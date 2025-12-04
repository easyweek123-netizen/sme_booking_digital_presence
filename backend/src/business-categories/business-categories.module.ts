import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessCategoriesService } from './business-categories.service';
import { BusinessCategoriesController } from './business-categories.controller';
import { BusinessCategory } from './entities/business-category.entity';
import { BusinessType } from './entities/business-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessCategory, BusinessType])],
  controllers: [BusinessCategoriesController],
  providers: [BusinessCategoriesService],
  exports: [BusinessCategoriesService],
})
export class BusinessCategoriesModule {}
