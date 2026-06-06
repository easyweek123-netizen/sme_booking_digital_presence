import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Repository } from 'typeorm';
import { Location, LocationType } from './entities/location.entity';
import { Business } from '../business/entities/business.entity';
import { Service } from '../services/entities/service.entity';
import { LocationView, toLocationView } from './types/location-view';
import {
  type CreateLocationDto,
  type AddressInput,
  type PhoneInput,
} from '@bookeasy/shared';
import { CalendarService } from '../calendar/calendar.service';

function normalizeAddressKey(a: {
  line1: string | null;
  line2: string | null;
  city: string | null;
  postalCode: string | null;
  countryCode: string | null;
}): string {
  const n = (s: string | null | undefined) => (s ?? '').trim().toLowerCase();
  return [
    n(a.line1),
    n(a.line2),
    n(a.city),
    n(a.postalCode),
    n(a.countryCode),
  ].join('|');
}

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly repo: Repository<Location>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    private readonly calendarService: CalendarService,
  ) {}

  async listForBusiness(businessId: number): Promise<LocationView[]> {
    const locations = await this.repo.find({
      where: { businessId },
      order: { createdAt: 'ASC' },
    });
    return locations.map(toLocationView);
  }

  async findByIdForBusiness(
    id: number,
    businessId: number,
  ): Promise<LocationView> {
    const location = await this.repo.findOne({ where: { id, businessId } });
    if (!location) throw new NotFoundException('Location not found');
    return toLocationView(location);
  }

  async getForBusiness(
    locationId: number | null,
    businessId: number,
  ): Promise<Location> {
    if (!locationId) {
      throw new BadRequestException({ code: 'LOCATION_REQUIRED' });
    }
    const loc = await this.repo.findOne({
      where: { id: locationId, businessId },
    });
    if (!loc) {
      throw new NotFoundException({ code: 'LOCATION_NOT_FOUND' });
    }
    return loc;
  }

  async create(
    businessId: number,
    dto: CreateLocationDto,
  ): Promise<LocationView> {
    switch (dto.type) {
      case 'ADDRESS':
        return this.createAddress(businessId, dto.data);
      case 'PHONE':
        return this.createPhone(businessId, dto.data);
      case 'ONLINE':
        return this.createOnline(businessId, dto.data.calendarId);
    }
  }

  /**
   * Update an existing location in place. Validates that the supplied DTO type
   * matches the persisted row's type (you cannot morph an ADDRESS row into a
   * PHONE row — delete it and create a new one instead). Reuses the existing
   * de-dup behaviour from create*().
   */
  async update(
    id: number,
    businessId: number,
    dto: CreateLocationDto,
  ): Promise<LocationView> {
    const existing = await this.repo.findOne({ where: { id, businessId } });
    if (!existing) throw new NotFoundException('Location not found');
    if (existing.type !== dto.type) {
      throw new BadRequestException({
        code: 'LOCATION_TYPE_MISMATCH',
        message: `Cannot change location type from ${existing.type} to ${dto.type}. Delete and re-create instead.`,
      });
    }
    switch (dto.type) {
      case 'ADDRESS':
        return this.updateAddress(existing, dto.data);
      case 'PHONE':
        return this.updatePhone(existing, dto.data);
      case 'ONLINE':
        return this.updateOnline(existing, dto.data.calendarId);
    }
  }

  private async createAddress(
    businessId: number,
    data: AddressInput,
  ): Promise<LocationView> {
    const key = normalizeAddressKey(data);
    const existing = (
      await this.repo.find({
        where: { businessId, type: LocationType.ADDRESS },
      })
    ).find((c) => normalizeAddressKey(c) === key);
    if (existing) return toLocationView(existing);

    const location = this.repo.create({
      businessId,
      type: LocationType.ADDRESS,
      line1: data.line1,
      line2: data.line2 ?? null,
      city: data.city,
      postalCode: data.postalCode ?? null,
      countryCode: data.countryCode,
      latitude: String(data.latitude),
      longitude: String(data.longitude),
    });
    const saved = await this.repo.save(location);
    const business = await this.businessRepo.findOne({
      where: { id: businessId },
    });
    if (business && business.defaultLocationId === null) {
      business.defaultLocationId = saved.id;
      await this.businessRepo.save(business);
    }
    return toLocationView(saved);
  }

  private async updateAddress(
    row: Location,
    data: AddressInput,
  ): Promise<LocationView> {
    row.line1 = data.line1;
    row.line2 = data.line2 ?? null;
    row.city = data.city;
    row.postalCode = data.postalCode ?? null;
    row.countryCode = data.countryCode;
    row.latitude = String(data.latitude);
    row.longitude = String(data.longitude);
    return toLocationView(await this.repo.save(row));
  }

  private async createPhone(
    businessId: number,
    data: PhoneInput,
  ): Promise<LocationView> {
    const parsed = parsePhoneNumberFromString(data.phoneNumber);
    if (!parsed?.isValid()) {
      throw new BadRequestException({
        code: 'INVALID_PHONE_NUMBER',
        message: 'Phone number is not valid.',
      });
    }
    const phoneNumber = parsed.format('E.164');

    const existing = await this.repo.findOne({
      where: { businessId, type: LocationType.PHONE, phoneNumber },
    });
    if (existing) return toLocationView(existing);

    const saved = await this.repo.save(
      this.repo.create({ businessId, type: LocationType.PHONE, phoneNumber }),
    );
    return toLocationView(saved);
  }

  private async updatePhone(
    row: Location,
    data: PhoneInput,
  ): Promise<LocationView> {
    const parsed = parsePhoneNumberFromString(data.phoneNumber);
    if (!parsed?.isValid()) {
      throw new BadRequestException({
        code: 'INVALID_PHONE_NUMBER',
        message: 'Phone number is not valid.',
      });
    }
    row.phoneNumber = parsed.format('E.164');
    return toLocationView(await this.repo.save(row));
  }

  private async createOnline(
    businessId: number,
    calendarId: number,
  ): Promise<LocationView> {
    const live = await this.calendarService.isConnectionLive(
      calendarId,
      businessId,
    );
    if (!live) {
      throw new BadRequestException({
        code: 'CALENDAR_NOT_AVAILABLE',
        message:
          'Calendar not found, not owned by this business, or connection is not live.',
      });
    }

    const existing = await this.repo.findOne({
      where: { businessId, type: LocationType.ONLINE, calendarId },
    });
    if (existing) return toLocationView(existing);

    const saved = await this.repo.save(
      this.repo.create({ businessId, type: LocationType.ONLINE, calendarId }),
    );
    return toLocationView(saved);
  }

  private async updateOnline(
    row: Location,
    calendarId: number,
  ): Promise<LocationView> {
    const live = await this.calendarService.isConnectionLive(
      calendarId,
      row.businessId,
    );
    if (!live) {
      throw new BadRequestException({
        code: 'CALENDAR_NOT_AVAILABLE',
        message:
          'Calendar not found, not owned by this business, or connection is not live.',
      });
    }
    row.calendarId = calendarId;
    return toLocationView(await this.repo.save(row));
  }

  async remove(id: number, businessId: number): Promise<void> {
    const location = await this.repo.findOne({ where: { id, businessId } });
    if (!location) throw new NotFoundException('Location not found');

    const inUse = await this.serviceRepo.count({
      where: { locationId: id, businessId },
    });
    if (inUse > 0) {
      throw new ConflictException({
        code: 'LOCATION_IN_USE',
        message: `This location is used by ${inUse} service${inUse > 1 ? 's' : ''}. Update those services before deleting it.`,
        count: inUse,
      });
    }

    const business = await this.businessRepo.findOne({
      where: { id: businessId },
    });
    if (business?.defaultLocationId === id) {
      business.defaultLocationId = null;
      await this.businessRepo.save(business);
    }

    await this.repo.remove(location);
  }
}
