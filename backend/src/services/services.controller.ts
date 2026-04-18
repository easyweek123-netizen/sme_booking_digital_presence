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
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { FirebaseAuthGuard } from '../auth/guards';
import { OwnerResolverInterceptor, OwnerId } from '../common';
import { Service } from './entities/service.entity';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * Create a new service
   * POST /api/services
   */
  @Post()
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(OwnerResolverInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @OwnerId() ownerId: number,
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    return this.servicesService.create(ownerId, createServiceDto);
  }

  /**
   * Get all services for a business (public)
   * GET /api/services/business/:businessId
   */
  @Get('business/:businessId')
  async findByBusiness(
    @Param('businessId', ParseIntPipe) businessId: number,
  ): Promise<Service[]> {
    return this.servicesService.findByBusiness(businessId);
  }

  /**
   * Get a single service by ID
   * GET /api/services/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  /**
   * Update a service
   * PATCH /api/services/:id
   */
  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(OwnerResolverInterceptor)
  async update(
    @OwnerId() ownerId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, ownerId, updateServiceDto);
  }

  /**
   * Delete a service. Hard deletes if no bookings exist, disables otherwise.
   * DELETE /api/services/:id
   */
  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(OwnerResolverInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @OwnerId() ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.servicesService.remove(id, ownerId);
  }
}
