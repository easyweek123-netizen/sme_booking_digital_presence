import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminBillingCleanupService } from './admin-billing-cleanup.service';
import { OwnerModule } from '../owner/owner.module';
import { BusinessModule } from '../business/business.module';
import { BookingsModule } from '../bookings/bookings.module';
import { Business } from '../business/entities/business.entity';
import { Invoice, Subscription } from '../billing/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Invoice, Business]),
    OwnerModule,
    BusinessModule,
    BookingsModule,
  ],
  controllers: [AdminController],
  providers: [AdminBillingCleanupService],
})
export class AdminModule {}
