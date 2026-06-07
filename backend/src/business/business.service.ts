import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere } from 'typeorm';
import { Business } from './entities/business.entity';
import { Service } from '../services/entities/service.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Availability } from '../schedule/entities/availability.entity';
import { DEFAULT_BUSINESS_HOURS } from '../schedule/defaults';
import { CreateBusinessDto, ServiceDto } from './dto/create-business.dto';
import type { BusinessPatchInput } from '@bookeasy/shared';
import {
  ABOUT_ALLOWED_TAGS,
  ABOUT_ALLOWED_ATTRS,
} from '@bookeasy/shared';
import type { WorkingHours } from './types/working-hours';
import { toLocationView } from '../locations/types/location-view';
import sanitizeHtml from 'sanitize-html';

function sanitizeAboutHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...ABOUT_ALLOWED_TAGS],
    allowedAttributes: ABOUT_ALLOWED_ATTRS as Record<string, string[]>,
    disallowedTagsMode: 'discard',
  });
}

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
    const existing = await this.businessRepository.findOne({
      where: { ownerId },
      relations: ['services', 'services.category', 'businessType'],
    });
    if (existing) return existing;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      const business = this.businessRepository.create({
        ownerId,
        name: dto.name,
        slug: this.generateSlug(dto.name),
        description: dto.description ?? null,
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
        isActive: true,
      }),
    );
  }

  async findByOwner(ownerId: number): Promise<Business> {
    return this.findByOwnerIdOrFail(ownerId);
  }

  private static readonly DOW_TO_KEY = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const;

  /** Project recurring `availability` rows into the WorkingHours shape the
   *  frontend booking page consumes. Returns null when there are no rows so
   *  callers / UI can distinguish "never configured" from "all closed". */
  private buildWorkingHours(
    availability: Availability[] | undefined,
  ): WorkingHours | null {
    if (!availability?.length) return null;
    const hours: WorkingHours = {
      sunday: { isOpen: false, openTime: '', closeTime: '' },
      monday: { isOpen: false, openTime: '', closeTime: '' },
      tuesday: { isOpen: false, openTime: '', closeTime: '' },
      wednesday: { isOpen: false, openTime: '', closeTime: '' },
      thursday: { isOpen: false, openTime: '', closeTime: '' },
      friday: { isOpen: false, openTime: '', closeTime: '' },
      saturday: { isOpen: false, openTime: '', closeTime: '' },
    };
    for (const row of availability) {
      if (!row.isRecurring || row.dayOfWeek == null) continue;
      const key = BusinessService.DOW_TO_KEY[row.dayOfWeek];
      if (!key) continue;
      hours[key] = {
        isOpen: !row.isClosed && !!row.startTime && !!row.endTime,
        openTime: row.startTime ?? '',
        closeTime: row.endTime ?? '',
      };
    }
    return hours;
  }

  /** Single read path used by every business lookup. Loads default schedule
   *  availability + all locations and projects them so the public booking page
   *  / API consumers receive workingHours and locations[] (LocationView shape).
   */
  private async loadBusiness(
    where: FindOptionsWhere<Business>,
  ): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where,
      relations: [
        'services',
        'services.category',
        'businessType',
        'defaultSchedule',
        'defaultSchedule.availabilities',
        'defaultLocation',
        'locations',
      ],
    });
    if (!business) throw new NotFoundException('Business not found');
    return Object.assign(business, {
      workingHours: this.buildWorkingHours(
        business.defaultSchedule?.availabilities,
      ),
      defaultLocation: business.defaultLocation
        ? toLocationView(business.defaultLocation)
        : null,
      locations: (business.locations ?? []).map(toLocationView),
    });
  }

  private async findByOwnerIdOrFail(ownerId: number): Promise<Business> {
    return this.loadBusiness({ ownerId });
  }

  async findByOwnerId(ownerId: number): Promise<Business | null> {
    const business = await this.businessRepository.findOne({
      where: { ownerId },
      relations: [
        'services',
        'services.category',
        'businessType',
        'owner',
        'defaultSchedule',
        'defaultSchedule.availabilities',
        'locations',
      ],
    });
    if (!business) return null;
    return Object.assign(business, {
      workingHours: this.buildWorkingHours(
        business.defaultSchedule?.availabilities,
      ),
      locations: (business.locations ?? []).map(toLocationView),
    });
  }

  async findOne(id: number): Promise<Business> {
    return this.loadBusiness({ id });
  }

  async findBySlug(slug: string): Promise<Business> {
    return this.loadBusiness({ slug });
  }

  /**
   * Update business by id. Ownership is enforced upstream by
   * BusinessOwnershipGuard which scopes the route to the owner's business.
   */
  async update(
    id: number,
    updateBusinessDto: BusinessPatchInput,
  ): Promise<Business> {
    const business = await this.findOne(id);

    if (updateBusinessDto.name !== undefined) {
      business.name = updateBusinessDto.name;
    }
    if (updateBusinessDto.description !== undefined) {
      business.description = updateBusinessDto.description || null;
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
      business.aboutContent = updateBusinessDto.aboutContent
        ? sanitizeAboutHtml(updateBusinessDto.aboutContent)
        : null;
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
    if (updateBusinessDto.showNextAvailable !== undefined) {
      business.showNextAvailable = updateBusinessDto.showNextAvailable;
    }
    if (updateBusinessDto.showWeeklyHours !== undefined) {
      business.showWeeklyHours = updateBusinessDto.showWeeklyHours;
    }

    await this.businessRepository.save(business);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.businessRepository.delete(id);
  }
}
