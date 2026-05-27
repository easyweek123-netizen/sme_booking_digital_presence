import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Not } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Availability } from './entities/availability.entity';
import { Service } from '../services/entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import {
  getAvailableSlots,
  resolveWindowsForDate,
  type Slot,
  type AvailabilityRow,
  type Service as SlotService,
} from './slot-generator';
import { subdivide } from '../common/time/zoned';
import { formatLocalYmd } from '../common/time/local-date';
import type {
  AvailabilityInput,
  ScheduleCreateInput,
  SchedulePatchInput,
} from '@bookeasy/shared';
import { DEFAULT_BUSINESS_HOURS } from './defaults';

export interface ServiceMeta {
  id: number;
  type: 'APPOINTMENT' | 'GROUP';
  capacity: number;
  durationMinutes: number;
  priceType: 'FIXED' | 'FROM' | 'FREE' | 'ON_REQUEST';
}

export interface SlotsResult {
  service: ServiceMeta;
  slots: Slot[];
}

export interface ScheduleWithAvailability extends Schedule {
  availability: Availability[];
}

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
    @InjectRepository(Availability)
    private readonly availability: Repository<Availability>,
    @InjectRepository(Service)
    private readonly services: Repository<Service>,
    @InjectRepository(Business)
    private readonly businesses: Repository<Business>,
    @InjectRepository(Booking)
    private readonly bookings: Repository<Booking>,
    private readonly dataSource: DataSource,
  ) {}

  // --------------------------------------------------------------------------
  // CRUD
  // --------------------------------------------------------------------------

  async listForBusiness(businessId: number): Promise<Schedule[]> {
    return this.schedules.find({
      where: { businessId },
      order: { createdAt: 'ASC' },
    });
  }

  async findForBusiness(
    id: number,
    businessId: number,
  ): Promise<ScheduleWithAvailability> {
    const schedule = await this.schedules.findOne({
      where: { id, businessId },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    let availability = await this.availability.find({
      where: { scheduleId: id },
    });
    if (availability.length === 0) {
      const entities = DEFAULT_BUSINESS_HOURS.map((h) =>
        this.availability.create({ scheduleId: id, ...h }),
      );
      availability = await this.availability.save(entities);
    }
    return Object.assign(schedule, { availability });
  }

  /** Internal: minimal schedule lookup for cross-module ownership checks. */
  async assertOwnedByBusiness(id: number, businessId: number): Promise<void> {
    const exists = await this.schedules.findOne({
      where: { id, businessId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Schedule not found');
  }

  async createForBusiness(
    businessId: number,
    dto: ScheduleCreateInput,
  ): Promise<ScheduleWithAvailability> {
    return this.dataSource.transaction(async (manager) => {
      const schedule = await manager.save(
        manager.create(Schedule, {
          businessId,
          name: dto.name,
          timezone: dto.timezone ?? null,
        }),
      );
      const rows = await this.replaceAvailability(
        schedule.id,
        dto.availability ?? [],
        manager.getRepository(Availability),
      );
      return Object.assign(schedule, { availability: rows });
    });
  }

  async updateForBusiness(
    id: number,
    businessId: number,
    dto: SchedulePatchInput,
  ): Promise<ScheduleWithAvailability> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Schedule);
      const schedule = await repo.findOne({ where: { id, businessId } });
      if (!schedule) throw new NotFoundException('Schedule not found');

      if (dto.name !== undefined) schedule.name = dto.name;
      if (dto.timezone !== undefined) schedule.timezone = dto.timezone;
      await repo.save(schedule);

      const rows =
        dto.availability !== undefined
          ? await this.replaceAvailability(
              schedule.id,
              dto.availability,
              manager.getRepository(Availability),
            )
          : await manager.getRepository(Availability).find({
              where: { scheduleId: schedule.id },
            });

      return Object.assign(schedule, { availability: rows });
    });
  }

  async removeForBusiness(id: number, businessId: number): Promise<void> {
    const schedule = await this.schedules.findOne({
      where: { id, businessId },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');

    const business = await this.businesses.findOne({
      where: { id: businessId },
      select: { id: true, defaultScheduleId: true },
    });
    if (business?.defaultScheduleId === id) {
      throw new ForbiddenException(
        'Cannot delete the business default schedule',
      );
    }

    const referencing = await this.services.count({
      where: { scheduleId: id },
    });
    if (referencing > 0) {
      throw new ConflictException('Schedule is in use by one or more services');
    }

    await this.schedules.remove(schedule);
  }

  private async replaceAvailability(
    scheduleId: number,
    rows: AvailabilityInput[],
    repo: Repository<Availability>,
  ): Promise<Availability[]> {
    await repo.delete({ scheduleId });
    if (rows.length === 0) return [];
    const entities = rows.map((r) =>
      repo.create({
        scheduleId,
        isRecurring: r.isRecurring,
        dayOfWeek: r.dayOfWeek ?? null,
        date: r.date ?? null,
        startTime: r.startTime ?? null,
        endTime: r.endTime ?? null,
        isClosed: r.isClosed ?? false,
      }),
    );
    return repo.save(entities);
  }

  // --------------------------------------------------------------------------
  // Slot generation (public bookable times + booking-time slot validation)
  // --------------------------------------------------------------------------

  async getSlots(
    serviceId: number,
    range: { from: string; to: string },
  ): Promise<SlotsResult> {
    const { service, availabilities, tz } = await this.loadContext(serviceId);

    const meta: ServiceMeta = {
      id: service.id,
      type: service.type,
      capacity: service.capacity,
      durationMinutes: service.durationMinutes,
      priceType: service.priceType,
    };

    if (service.priceType === 'ON_REQUEST') {
      return { service: meta, slots: [] };
    }

    const existing = await this.bookings.find({
      where: { serviceId, status: Not(BookingStatus.CANCELLED) },
    });
    const bookingRows = existing.map((b) => ({
      serviceId: b.serviceId,
      date:
        typeof b.date === 'string'
          ? b.date
          : formatLocalYmd(b.date as unknown as Date),
      startTime: b.startTime,
    }));

    const slots = getAvailableSlots(
      {
        id: service.id,
        type: service.type,
        capacity: service.capacity,
        durationMinutes: service.durationMinutes,
        pauseAfterMinutes: service.pauseAfterMinutes,
      } satisfies SlotService,
      availabilities,
      range,
      bookingRows,
      new Date(),
      tz,
    );

    return { service: meta, slots };
  }

  async findSlot(
    serviceId: number,
    date: string,
    startTime: string,
  ): Promise<Slot & { capacity: number }> {
    const { service, availabilities, tz } = await this.loadContext(serviceId);

    if (service.priceType === 'ON_REQUEST') {
      throw new BadRequestException(
        'Service requires an inquiry, not a booking',
      );
    }

    const windows = resolveWindowsForDate(availabilities, date, tz);
    const candidates =
      service.type === 'APPOINTMENT'
        ? windows.flatMap((w) =>
            subdivide(w, service.durationMinutes, service.pauseAfterMinutes),
          )
        : windows.map((w) => ({ start: w.start, end: w.end }));

    const match = candidates.find((s) => s.start === startTime);
    if (!match) throw new ConflictException('Slot not in availability');

    return {
      date,
      startTime: match.start,
      endTime: match.end,
      seatsRemaining: service.capacity,
      capacity: service.capacity,
    };
  }

  private async loadContext(serviceId: number): Promise<{
    service: Service;
    availabilities: AvailabilityRow[];
    tz: string;
  }> {
    const service = await this.services.findOne({
      where: { id: serviceId, isActive: true },
      relations: ['business'],
    });
    if (!service) throw new NotFoundException('Service not found or inactive');

    const tz = service.business?.timezone ?? 'Europe/Vienna';
    const rows = await this.availability.find({
      where: { scheduleId: service.scheduleId },
    });

    const availabilities: AvailabilityRow[] = rows.map((a) => ({
      isRecurring: a.isRecurring,
      dayOfWeek: a.dayOfWeek,
      date: a.date,
      startTime: a.startTime,
      endTime: a.endTime,
      isClosed: a.isClosed,
    }));

    return { service, availabilities, tz };
  }
}
