import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LocationsService } from './locations.service';
import { FirebaseAuthGuard } from '../auth/guards';
import {
  BusinessId,
  BusinessOwnershipGuard,
  OwnerResolverGuard,
} from '../common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { LocationView } from './types/location-view';
import {
  AddressCandidate,
  GeocodingService,
} from './geocoding/geocoding.service';
import { CreateLocationSchema, type CreateLocationDto } from '@bookeasy/shared';

@Controller('businesses/me/locations')
@UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly geocoding: GeocodingService,
  ) {}

  @Get('address/search')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  searchAddress(@Query('q') q: string): Promise<AddressCandidate[]> {
    return this.geocoding.search(q ?? '');
  }

  @Get('address/reverse')
  reverseAddress(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ): Promise<AddressCandidate | null> {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
      throw new BadRequestException('lat and lng must be finite numbers');
    }
    return this.geocoding.reverse(latNum, lngNum);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @BusinessId() businessId: number,
    @Body(new ZodValidationPipe(CreateLocationSchema)) dto: CreateLocationDto,
  ): Promise<LocationView> {
    return this.locationsService.create(businessId, dto);
  }

  @Get()
  list(@BusinessId() businessId: number): Promise<LocationView[]> {
    return this.locationsService.listForBusiness(businessId);
  }

  @Get(':id')
  findOne(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LocationView> {
    return this.locationsService.findByIdForBusiness(id, businessId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.locationsService.remove(id, businessId);
  }
}
