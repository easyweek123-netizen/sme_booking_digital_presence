import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { Business } from './entities/business.entity';
import { Service } from '../services/entities/service.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Availability } from '../schedule/entities/availability.entity';
import { AuthModule } from '../auth/auth.module';
import { BusinessOwnershipGuard } from '../common';
import { GetBusinessTool, UpdateBusinessTool } from './tools';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, Service, Schedule, Availability]),
    AuthModule,
  ],
  controllers: [BusinessController],
  providers: [
    BusinessService,
    BusinessOwnershipGuard,
    GetBusinessTool,
    UpdateBusinessTool,
  ],
  exports: [BusinessService],
})
export class BusinessModule {}
