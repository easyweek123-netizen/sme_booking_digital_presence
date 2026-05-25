import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { Business } from '../business/entities/business.entity';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Business])],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
