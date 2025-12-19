import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { AuthModule } from '../auth/auth.module';
import { BusinessModule } from '../business/business.module';
import {
  ListServicesHandler,
  CreateServiceHandler,
  UpdateServiceHandler,
  DeleteServiceHandler,
} from './handlers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Business]),
    AuthModule,
    BusinessModule,
  ],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    ListServicesHandler,
    CreateServiceHandler,
    UpdateServiceHandler,
    DeleteServiceHandler,
  ],
  exports: [
    ServicesService,
    ListServicesHandler,
    CreateServiceHandler,
    UpdateServiceHandler,
    DeleteServiceHandler,
  ],
})
export class ServicesModule {}
