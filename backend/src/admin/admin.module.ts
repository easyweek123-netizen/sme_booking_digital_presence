import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminBillingCleanupService } from './admin-billing-cleanup.service';
import { AdminOwnerCleanupService } from './admin-owner-cleanup.service';
import { OwnerModule } from '../owner/owner.module';
import { BusinessModule } from '../business/business.module';
import { BookingsModule } from '../bookings/bookings.module';
import { Business } from '../business/entities/business.entity';
import { Invoice, Subscription } from '../billing/entities';
import { Booking } from '../bookings/entities/booking.entity';
import { BillingEvent } from '../billing/entities/billing-event.entity';
import { Note } from '../notes/entities/note.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscription,
      Invoice,
      Business,
      Booking,
      BillingEvent,
      Note,
    ]),
    OwnerModule,
    BusinessModule,
    BookingsModule,
  ],
  controllers: [AdminController],
  providers: [AdminBillingCleanupService, AdminOwnerCleanupService],
})
export class AdminModule {}
