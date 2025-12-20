import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { AuthModule } from '../auth/auth.module';
import { BusinessModule } from '../business/business.module';
import {
  CreateServiceTool,
  ListServicesTool,
  UpdateServiceTool,
  DeleteServiceTool,
} from './tools';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Business]),
    AuthModule,
    BusinessModule,
  ],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    // Tool handlers - auto-discovered by ToolsModule
    CreateServiceTool,
    ListServicesTool,
    UpdateServiceTool,
    DeleteServiceTool,
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
