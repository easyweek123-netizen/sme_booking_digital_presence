import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Availability } from './entities/availability.entity';
import { Service } from '../services/entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { SlotsController } from './slots.controller';
import { AuthModule } from '../auth/auth.module';
import { BusinessOwnershipGuard } from '../common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Schedule,
      Availability,
      Service,
      Business,
      Booking,
    ]),
    AuthModule,
  ],
  controllers: [ScheduleController, SlotsController],
  providers: [ScheduleService, BusinessOwnershipGuard],
  exports: [ScheduleService, TypeOrmModule],
})
export class ScheduleModule {}
