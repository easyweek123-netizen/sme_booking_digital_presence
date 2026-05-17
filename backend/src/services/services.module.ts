import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { AuthModule } from '../auth/auth.module';
import { BillingModule } from '../billing/billing.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { BusinessOwnershipGuard } from '../common';
import {
  CreateServiceTool,
  ListServicesTool,
  UpdateServiceTool,
  DeleteServiceTool,
} from './tools';
import { ActiveServicesCounter } from './counters/active-services.counter';
import { CounterKey } from '../entitlements/config/counter-keys';
import { COUNTER_TOKEN } from '../entitlements/counters/usage-counter.registry';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Business]),
    ScheduleModule,
    AuthModule,
    BillingModule,
  ],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    BusinessOwnershipGuard,
    ActiveServicesCounter,
    {
      provide: COUNTER_TOKEN(CounterKey.ActiveServices),
      useExisting: ActiveServicesCounter,
    },
    CreateServiceTool,
    ListServicesTool,
    UpdateServiceTool,
    DeleteServiceTool,
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
