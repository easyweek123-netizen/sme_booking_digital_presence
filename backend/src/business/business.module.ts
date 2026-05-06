import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { Business } from './entities/business.entity';
import { Service } from '../services/entities/service.entity';
import { AuthModule } from '../auth/auth.module';
import { GetBusinessTool, UpdateBusinessTool } from './tools';

@Module({
  imports: [TypeOrmModule.forFeature([Business, Service]), AuthModule],
  controllers: [BusinessController],
  providers: [BusinessService, GetBusinessTool, UpdateBusinessTool],
  exports: [BusinessService],
})
export class BusinessModule {}
