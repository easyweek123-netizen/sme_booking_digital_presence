import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { CreateServiceCategoryDto, UpdateServiceCategoryDto } from './dto';
import { FirebaseAuthGuard } from '../auth/guards';
import { OwnerResolverInterceptor, OwnerId } from '../common';
import { ServiceCategory } from './entities/service-category.entity';

@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(private readonly serviceCategoriesService: ServiceCategoriesService) {}

  /**
   * Create a new service category
   * POST /api/service-categories
   */
  @Post()
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(OwnerResolverInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @OwnerId() ownerId: number,
    @Body() createCategoryDto: CreateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoriesService.create(ownerId, createCategoryDto);
  }

  /**
   * Get all categories for a business (public)
   * GET /api/service-categories/business/:businessId
   */
  @Get('business/:businessId')
  async findByBusiness(
    @Param('businessId', ParseIntPipe) businessId: number,
  ): Promise<ServiceCategory[]> {
    return this.serviceCategoriesService.findByBusiness(businessId);
  }

  /**
   * Get a single category by ID
   * GET /api/service-categories/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ServiceCategory> {
    return this.serviceCategoriesService.findOne(id);
  }

  /**
   * Update a service category
   * PATCH /api/service-categories/:id
   */
  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(OwnerResolverInterceptor)
  async update(
    @OwnerId() ownerId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoriesService.update(id, ownerId, updateCategoryDto);
  }

  /**
   * Delete a service category
   * DELETE /api/service-categories/:id
   */
  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(OwnerResolverInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @OwnerId() ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.serviceCategoriesService.remove(id, ownerId);
  }
}

