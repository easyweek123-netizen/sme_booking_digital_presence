import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { CreateServiceCategoryDto, UpdateServiceCategoryDto } from './dto';
import { FirebaseAuthGuard } from '../auth/guards';
import { ServiceCategory } from './entities/service-category.entity';
import type { RequestWithFirebaseUser } from '../common';

@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(private readonly serviceCategoriesService: ServiceCategoriesService) {}

  /**
   * Create a new service category
   * POST /api/service-categories
   */
  @Post()
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: RequestWithFirebaseUser,
    @Body() createCategoryDto: CreateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoriesService.create(req.firebaseUser, createCategoryDto);
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
  async update(
    @Request() req: RequestWithFirebaseUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoriesService.update(id, req.firebaseUser, updateCategoryDto);
  }

  /**
   * Delete a service category
   * DELETE /api/service-categories/:id
   */
  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() req: RequestWithFirebaseUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.serviceCategoriesService.remove(id, req.firebaseUser);
  }
}

