import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { CreateServiceCategoryDto, UpdateServiceCategoryDto } from './dto';
import { FirebaseAuthGuard } from '../auth/guards';
import {
  BusinessId,
  BusinessOwnershipGuard,
  OwnerResolverGuard,
} from '../common';
import { ServiceCategory } from './entities/service-category.entity';

@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(
    private readonly serviceCategoriesService: ServiceCategoriesService,
  ) {}

  @Post()
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @BusinessId() businessId: number,
    @Body() createCategoryDto: CreateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoriesService.create(businessId, createCategoryDto);
  }

  @Get('business/:businessId')
  async findByBusiness(
    @Param('businessId', ParseIntPipe) businessId: number,
  ): Promise<ServiceCategory[]> {
    return this.serviceCategoriesService.findByBusiness(businessId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceCategory> {
    return this.serviceCategoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
  async update(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoriesService.update(
      id,
      businessId,
      updateCategoryDto,
    );
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.serviceCategoriesService.remove(id, businessId);
  }
}
