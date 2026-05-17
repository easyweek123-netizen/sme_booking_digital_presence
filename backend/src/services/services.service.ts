import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Service } from './entities/service.entity';
import { ScheduleService } from '../schedule/schedule.service';
import type { ServiceCreateInput, ServicePatchInput } from '@bookeasy/shared';

function withMappedAvailability<T extends { schedule?: unknown }>(s: T): T {
  const sched = s.schedule as Record<string, unknown> | null | undefined;
  if (sched && 'availabilities' in sched) {
    sched['availability'] = sched['availabilities'];
    delete sched['availabilities'];
  }
  return s;
}

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly scheduleService: ScheduleService,
  ) {}

  async create(businessId: number, dto: ServiceCreateInput): Promise<Service> {
    await this.scheduleService.assertOwnedByBusiness(
      dto.scheduleId,
      businessId,
    );
    const service = this.serviceRepository.create({
      businessId,
      categoryId: dto.categoryId ?? null,
      scheduleId: dto.scheduleId,
      type: dto.type,
      name: dto.name,
      description: dto.description ?? null,
      capacity: dto.capacity,
      durationMinutes: dto.durationMinutes,
      pauseAfterMinutes: dto.pauseAfterMinutes ?? 0,
      price: dto.price ?? null,
      priceType: dto.priceType,
      locationType: dto.locationType,
      locationMeta: dto.locationMeta ?? null,
      color: dto.color ?? null,
      photoUrl: dto.photoUrl ?? null,
      isActive: true,
    });
    return this.serviceRepository.save(service);
  }

  async findByBusiness(businessId: number): Promise<Service[]> {
    const services = await this.serviceRepository.find({
      where: { businessId, isActive: true },
      relations: ['category', 'schedule', 'schedule.availabilities'],
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
    return services.map(withMappedAvailability);
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['schedule', 'schedule.availabilities'],
    });
    if (!service) throw new NotFoundException('Service not found');
    return withMappedAvailability(service);
  }

  async findByNameAndBusiness(
    name: string,
    businessId: number,
  ): Promise<Service | null> {
    return this.serviceRepository.findOne({
      where: { name: ILike(name), businessId },
      relations: ['category'],
    });
  }

  async findByIdAndBusiness(
    id: number,
    businessId: number,
  ): Promise<Service | null> {
    return this.serviceRepository.findOne({
      where: { id, businessId },
      relations: ['category'],
    });
  }

  async update(
    id: number,
    businessId: number,
    dto: ServicePatchInput,
  ): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id, businessId },
    });
    if (!service) throw new NotFoundException('Service not found');

    if (dto.scheduleId !== undefined) {
      await this.scheduleService.assertOwnedByBusiness(
        dto.scheduleId,
        businessId,
      );
    }

    for (const key of [
      'categoryId',
      'scheduleId',
      'type',
      'name',
      'description',
      'capacity',
      'durationMinutes',
      'pauseAfterMinutes',
      'price',
      'priceType',
      'locationType',
      'locationMeta',
      'color',
      'photoUrl',
    ] as const) {
      if ((dto as Record<string, unknown>)[key] !== undefined) {
        (service as unknown as Record<string, unknown>)[key] = (
          dto as Record<string, unknown>
        )[key];
      }
    }
    return this.serviceRepository.save(service);
  }

  /**
   * Soft-delete (deactivate) if the service has bookings, otherwise hard
   * delete. Scoped by businessId.
   */
  async remove(id: number, businessId: number): Promise<void> {
    const service = await this.serviceRepository.findOne({
      where: { id, businessId },
      relations: ['bookings'],
    });
    if (!service) throw new NotFoundException('Service not found');

    if (service.bookings && service.bookings.length > 0) {
      service.isActive = false;
      await this.serviceRepository.save(service);
      return;
    }
    await this.serviceRepository.remove(service);
  }
}
