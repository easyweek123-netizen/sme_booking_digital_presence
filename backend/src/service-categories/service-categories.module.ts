import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategoriesService } from './service-categories.service';
import { ServiceCategoriesController } from './service-categories.controller';
import { ServiceCategory } from './entities/service-category.entity';
import { Business } from '../business/entities/business.entity';
import { AuthModule } from '../auth/auth.module';
import { BusinessOwnershipGuard } from '../common';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory, Business]), AuthModule],
  controllers: [ServiceCategoriesController],
  providers: [ServiceCategoriesService, BusinessOwnershipGuard],
  exports: [ServiceCategoriesService],
})
export class ServiceCategoriesModule {}
