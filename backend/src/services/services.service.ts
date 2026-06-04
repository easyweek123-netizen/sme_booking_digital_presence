import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Service } from './entities/service.entity';
import { ScheduleService } from '../schedule/schedule.service';
import { LocationsService } from '../locations/locations.service';
import { toLocationView } from '../locations/types/location-view';
import type { Location } from '../locations/entities/location.entity';
import type { ServiceCreateInput, ServicePatchInput } from '@bookeasy/shared';

function withMappedLocation(s: Service): Service {
  if (s.location) {
    (s as unknown as { location: unknown }).location = toLocationView(
      s.location,
    );
  }
  return s;
}

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
    private readonly locationsService: LocationsService,
  ) {}

  async create(businessId: number, dto: ServiceCreateInput): Promise<Service> {
    await this.scheduleService.assertOwnedByBusiness(
      dto.scheduleId,
      businessId,
    );
    await this.locationsService.getForBusiness(dto.locationId, businessId);
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
      locationId: dto.locationId,
      color: dto.color ?? null,
      photoUrl: dto.photoUrl ?? null,
      isActive: true,
    });
    return this.serviceRepository.save(service);
  }

  async findByBusiness(businessId: number): Promise<Service[]> {
    const services = await this.serviceRepository.find({
      where: { businessId, isActive: true },
      relations: [
        'category',
        'schedule',
        'schedule.availabilities',
        'location',
      ],
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
    return services.map((s) => withMappedLocation(withMappedAvailability(s)));
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['schedule', 'schedule.availabilities', 'location'],
    });
    if (!service) throw new NotFoundException('Service not found');
    return withMappedLocation(withMappedAvailability(service));
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

    if (dto.locationId !== undefined) {
      await this.locationsService.getForBusiness(dto.locationId, businessId);
      service.locationId = dto.locationId;
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
