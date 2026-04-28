import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { OwnerModule } from '../owner/owner.module';
import { BusinessModule } from '../business/business.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [OwnerModule, BusinessModule, BookingsModule],
  controllers: [AdminController],
})
export class AdminModule {}
