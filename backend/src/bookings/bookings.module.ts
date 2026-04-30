import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import {
  ListBookingsTool,
  BookingStatsTool,
  UpdateBookingStatusTool,
} from './tools';
import { Booking } from './entities/booking.entity';
import { Business } from '../business/entities/business.entity';
import { Service } from '../services/entities/service.entity';
import { AuthModule } from '../auth/auth.module';
import { CustomersModule } from '../customers/customers.module';
import { EmailModule } from '../email/email.module';
import { MonthlyConfirmedBookingsCounter } from './counters/monthly-confirmed-bookings.counter';
import { CounterKey } from '../entitlements/config/counter-keys';
import { COUNTER_TOKEN } from '../entitlements/counters/usage-counter.registry';
import { BillingModule } from 'src/billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Business, Service]),
    AuthModule,
    CustomersModule,
    EmailModule,
    BillingModule,
  ],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    MonthlyConfirmedBookingsCounter,
    {
      provide: COUNTER_TOKEN(CounterKey.MonthlyConfirmedBookings),
      useExisting: MonthlyConfirmedBookingsCounter,
    },
    ListBookingsTool,
    BookingStatsTool,
    UpdateBookingStatusTool,
  ],
  exports: [BookingsService],
})
export class BookingsModule {}
