import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { AuthModule } from '../auth/auth.module';
import { BusinessModule } from '../business/business.module';
import { ServiceToolHandler } from './service.tool-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Business]),
    AuthModule,
    BusinessModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService, ServiceToolHandler],
  exports: [ServicesService, ServiceToolHandler],
})
export class ServicesModule {}
