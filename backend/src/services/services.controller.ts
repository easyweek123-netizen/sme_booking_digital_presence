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
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { FirebaseAuthGuard } from '../auth/guards';
import { Service } from './entities/service.entity';
import type { RequestWithFirebaseUser } from '../common';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * Create a new service
   * POST /api/services
   */
  @Post()
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: RequestWithFirebaseUser,
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    return this.servicesService.create(req.firebaseUser, createServiceDto);
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
  async update(
    @Request() req: RequestWithFirebaseUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, req.firebaseUser, updateServiceDto);
  }

  /**
   * Delete a service from the database
   * DELETE /api/services/:id
   */
  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() req: RequestWithFirebaseUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.servicesService.remove(id, req.firebaseUser);
  }
}
