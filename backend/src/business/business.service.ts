import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Business } from './entities/business.entity';
import { LocationType, Service } from '../services/entities/service.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Availability } from '../schedule/entities/availability.entity';
import { DEFAULT_BUSINESS_HOURS } from '../schedule/defaults';
import { CreateBusinessDto, ServiceDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly dataSource: DataSource,
  ) {}

  /** Generate URL-friendly slug: full-business-name + 4 random alphanumeric */
  private generateSlug(name: string): string {
    const baseName = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${baseName}-${suffix}`;
  }

  /** Create a new business with default schedule and optional services. */
  async create(ownerId: number, dto: CreateBusinessDto): Promise<Business> {
    if (await this.businessRepository.exist({ where: { ownerId } })) {
      throw new ConflictException('You already have a business registered');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      const business = this.businessRepository.create({
        ownerId,
        name: dto.name,
        slug: this.generateSlug(dto.name),
        phone: dto.phone ?? null,
        description: dto.description ?? null,
        address: dto.address ?? null,
        city: dto.city ?? null,
        logoUrl: dto.logoUrl ?? null,
        brandColor: dto.brandColor ?? null,
        businessTypeId: dto.businessTypeId ?? null,
      });

      await manager.save(business);

      const schedule = this.scheduleRepository.create({
        businessId: business.id,
        name: 'Default',
      });

      await manager.save(schedule);

      business.defaultScheduleId = schedule.id;

      const availability = DEFAULT_BUSINESS_HOURS.map((row) =>
        this.availabilityRepository.create({
          scheduleId: schedule.id,
          isRecurring: row.isRecurring,
          dayOfWeek: row.dayOfWeek ?? null,
          startTime: row.startTime ?? null,
          endTime: row.endTime ?? null,
          isClosed: row.isClosed ?? false,
        }),
      );

      const services = this.buildOnboardingServices(
        dto.services ?? [],
        business.id,
        schedule.id,
      );

      await manager.save(business);
      if (availability.length) await manager.save(availability);
      if (services.length) await manager.save(services);

      await queryRunner.commitTransaction();
      return this.findByOwnerIdOrFail(ownerId);
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private buildOnboardingServices(
    dtos: ServiceDto[],
    businessId: number,
    scheduleId: number,
  ): Service[] {
    return dtos.map((s) =>
      this.serviceRepository.create({
        businessId,
        scheduleId,
        name: s.name,
        durationMinutes: s.durationMinutes,
        type: 'APPOINTMENT',
        capacity: 1,
        pauseAfterMinutes: 0,
        price: s.price != null ? Number(s.price).toFixed(2) : null,
        priceType: 'FIXED',
        locationType: LocationType.AT_BUSINESS,
        isActive: true,
      }),
    );
  }

  async findByOwner(ownerId: number): Promise<Business> {
    return this.findByOwnerIdOrFail(ownerId);
  }

  private async findByOwnerIdOrFail(ownerId: number): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { ownerId },
      relations: ['services', 'services.category', 'businessType'],
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async findByOwnerId(ownerId: number): Promise<Business | null> {
    return this.businessRepository.findOne({
      where: { ownerId },
      relations: ['services', 'services.category', 'businessType', 'owner'],
    });
  }

  async findOne(id: number): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['services', 'services.category', 'businessType'],
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async findBySlug(slug: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { slug },
      relations: ['services', 'services.category', 'businessType'],
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  /**
   * Update business by id. Ownership is enforced upstream by
   * BusinessOwnershipGuard which scopes the route to the owner's business.
   */
  async update(
    id: number,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    const business = await this.findOne(id);

    if (updateBusinessDto.name !== undefined) {
      business.name = updateBusinessDto.name;
    }
    if (updateBusinessDto.phone !== undefined) {
      business.phone = updateBusinessDto.phone || null;
    }
    if (updateBusinessDto.description !== undefined) {
      business.description = updateBusinessDto.description || null;
    }
    if (updateBusinessDto.address !== undefined) {
      business.address = updateBusinessDto.address || null;
    }
    if (updateBusinessDto.city !== undefined) {
      business.city = updateBusinessDto.city || null;
    }
    if (updateBusinessDto.website !== undefined) {
      business.website = updateBusinessDto.website || null;
    }
    if (updateBusinessDto.instagram !== undefined) {
      business.instagram = updateBusinessDto.instagram || null;
    }
    if (updateBusinessDto.logoUrl !== undefined) {
      business.logoUrl = updateBusinessDto.logoUrl || null;
    }
    if (updateBusinessDto.brandColor !== undefined) {
      business.brandColor = updateBusinessDto.brandColor || null;
    }
    if (updateBusinessDto.coverImageUrl !== undefined) {
      business.coverImageUrl = updateBusinessDto.coverImageUrl || null;
    }
    if (updateBusinessDto.aboutContent !== undefined) {
      business.aboutContent = updateBusinessDto.aboutContent || null;
    }
    if (updateBusinessDto.timezone !== undefined) {
      if (updateBusinessDto.timezone) {
        try {
          new Intl.DateTimeFormat('en-US', {
            timeZone: updateBusinessDto.timezone,
          });
        } catch {
          throw new BadRequestException('Invalid timezone identifier');
        }
      }
      business.timezone = updateBusinessDto.timezone;
    }

    await this.businessRepository.save(business);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.businessRepository.delete(id);
  }
}
