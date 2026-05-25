import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { AuthModule } from '../auth/auth.module';
import { BusinessModule } from '../business/business.module';
import { BillingModule } from '../billing/billing.module';
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
    AuthModule,
    BusinessModule,
    BillingModule,
  ],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    ActiveServicesCounter,
    {
      provide: COUNTER_TOKEN(CounterKey.ActiveServices),
      useExisting: ActiveServicesCounter,
    },
    // Tool handlers - auto-discovered by ToolsModule
    CreateServiceTool,
    ListServicesTool,
    UpdateServiceTool,
    DeleteServiceTool,
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
