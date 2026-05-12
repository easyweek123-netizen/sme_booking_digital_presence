import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { Business } from '../business/entities/business.entity';
import { EmailService } from './email.service';
import { BookingNotificationListener } from './listeners/booking-notification.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Business])],
  providers: [EmailService, BookingNotificationListener],
  exports: [EmailService],
})
export class EmailModule {}
