import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { OwnerModule } from '../owner/owner.module';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [OwnerModule, BusinessModule],
  controllers: [AdminController],
})
export class AdminModule {}

