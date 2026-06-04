import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Business } from '../business/entities/business.entity';
import { Service } from '../services/entities/service.entity';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { AuthModule } from '../auth/auth.module';
import { CalendarModule } from '../calendar/calendar.module';
import { BusinessOwnershipGuard } from '../common';
import { geocoderProvider } from './geocoding/geocoder.provider';
import { GeocodingService } from './geocoding/geocoding.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Business, Service]),
    AuthModule,
    CalendarModule,
  ],
  controllers: [LocationsController],
  providers: [
    LocationsService,
    BusinessOwnershipGuard,
    geocoderProvider,
    GeocodingService,
  ],
  exports: [LocationsService, GeocodingService],
})
export class LocationsModule {}
