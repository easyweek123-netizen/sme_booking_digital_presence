import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { ScheduleService } from '../schedule/schedule.service';
import { generateBookingReference } from '../common';
import { BookingCreatedEvent, BookingStatusChangedEvent } from './events';
import { formatLocalYmd } from '../common/time/local-date';
import type { BookingCreateInput } from '@bookeasy/shared';

export interface BookingsFilter {
  status?: BookingStatus;
  from?: string;
  to?: string;
}

export interface BookingStats {
  total: number;
  today: number;
  pending: number;
  byStatus: Record<BookingStatus, number>;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookings: Repository<Booking>,
    private readonly schedule: ScheduleService,
    private readonly events: EventEmitter2,
  ) {}

  async create(dto: BookingCreateInput, customerId: number): Promise<Booking> {
    const slot = await this.schedule.findSlot(
      dto.serviceId,
      dto.date,
      dto.startTime,
    );

    const taken = await this.bookings.count({
      where: {
        serviceId: dto.serviceId,
        date: dto.date as unknown as Date,
        startTime: dto.startTime,
        status: Not(BookingStatus.CANCELLED),
      },
    });
    if (taken >= slot.capacity) {
      throw new ConflictException('Slot capacity reached');
    }

    const saved = await this.bookings.save(
      this.bookings.create({
        reference: generateBookingReference(),
        serviceId: dto.serviceId,
        customerId,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        date: new Date(dto.date) as unknown as Date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: BookingStatus.PENDING,
        notes: dto.notes ?? null,
      }),
    );

    this.events.emit(
      BookingCreatedEvent.NAME,
      new BookingCreatedEvent(saved.id),
    );
    return this.findOne(saved.id);
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookings.findOne({
      where: { id },
      relations: ['service'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findByReference(reference: string): Promise<Booking> {
    const booking = await this.bookings.findOne({
      where: { reference: reference.toUpperCase() },
      relations: ['service'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findByBusiness(
    businessId: number,
    filters: BookingsFilter = {},
  ): Promise<Booking[]> {
    const qb = this.bookings
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .where('service.businessId = :businessId', { businessId });

    if (filters.status) {
      qb.andWhere('booking.status = :status', { status: filters.status });
    }
    if (filters.from) {
      qb.andWhere('booking.date >= :from', { from: filters.from });
    }
    if (filters.to) {
      qb.andWhere('booking.date <= :to', { to: filters.to });
    }

    return qb
      .orderBy('booking.date', 'ASC')
      .addOrderBy('booking.startTime', 'ASC')
      .getMany();
  }

  async findOneByBusiness(
    businessId: number,
    lookup: { id?: number; reference?: string },
  ): Promise<Booking | null> {
    const hasId = lookup.id !== undefined;
    const hasRef =
      lookup.reference !== undefined && lookup.reference.trim().length > 0;
    if (!hasId && !hasRef) return null;

    const qb = this.bookings
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.service', 'service')
      .where('service.businessId = :businessId', { businessId });

    if (hasId) {
      qb.andWhere('booking.id = :id', { id: lookup.id });
    } else {
      qb.andWhere('booking.reference = :ref', {
        ref: lookup.reference!.toUpperCase(),
      });
    }
    return qb.getOne();
  }

  async getStats(businessId: number): Promise<BookingStats> {
    const statusRows = await this.bookings
      .createQueryBuilder('booking')
      .innerJoin('booking.service', 'service')
      .select('booking.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('service.businessId = :businessId', { businessId })
      .groupBy('booking.status')
      .getRawMany<{ status: string; count: string }>();

    const byStatus = {} as Record<BookingStatus, number>;
    for (const s of Object.values(BookingStatus)) byStatus[s] = 0;
    for (const row of statusRows) {
      const s = row.status as BookingStatus;
      if (s in byStatus) byStatus[s] = Number(row.count);
    }

    const total = Object.entries(byStatus)
      .filter(([k]) => (k as BookingStatus) !== BookingStatus.CANCELLED)
      .reduce((sum, [, n]) => sum + n, 0);
    const pending = byStatus[BookingStatus.PENDING];

    const todayDate = new Date(formatLocalYmd(new Date()));
    const today = await this.bookings
      .createQueryBuilder('booking')
      .innerJoin('booking.service', 'service')
      .where('service.businessId = :businessId', { businessId })
      .andWhere('booking.date = :date', { date: todayDate })
      .andWhere('booking.status != :cancelled', {
        cancelled: BookingStatus.CANCELLED,
      })
      .getCount();

    return { total, today, pending, byStatus };
  }

  /**
   * Update a booking's status. Caller is expected to have verified the booking
   * belongs to a known business via findOneByBusiness, or to call this from
   * an HTTP route protected by BusinessOwnershipGuard with prior scope check.
   */
  async updateStatus(id: number, status: BookingStatus): Promise<Booking> {
    const booking = await this.findOne(id);
    const previous = booking.status;
    if (previous === status) return booking;

    booking.status = status;
    if (
      status === BookingStatus.CONFIRMED &&
      previous !== BookingStatus.CONFIRMED
    ) {
      booking.confirmedAt = new Date();
    }
    await this.bookings.save(booking);

    this.events.emit(
      BookingStatusChangedEvent.NAME,
      new BookingStatusChangedEvent(booking.id, previous, status),
    );
    return this.findOne(id);
  }

  /**
   * Update status scoped by businessId. Returns 404 if the booking is not
   * in this business. Used by HTTP routes after BusinessOwnershipGuard.
   */
  async updateStatusForBusiness(
    id: number,
    businessId: number,
    status: BookingStatus,
  ): Promise<Booking> {
    const booking = await this.findOneByBusiness(businessId, { id });
    if (!booking) throw new NotFoundException('Booking not found');
    return this.updateStatus(id, status);
  }

  async remove(
    id: number,
    expectedReference?: string,
  ): Promise<{ deletedId: number; reference: string }> {
    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);

    if (
      expectedReference !== undefined &&
      expectedReference.trim().length > 0 &&
      booking.reference.toUpperCase() !== expectedReference.trim().toUpperCase()
    ) {
      throw new BadRequestException(
        `Reference mismatch: booking ${id} has reference ${booking.reference}`,
      );
    }
    await this.bookings.remove(booking);
    return { deletedId: id, reference: booking.reference };
  }
}
