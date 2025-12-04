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
import { JwtAuthGuard } from '../auth/guards';
import { Service } from './entities/service.entity';
import type { RequestWithUser } from '../common';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * Create a new service
   * POST /api/services
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: RequestWithUser,
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    return this.servicesService.create(req.user.id, createServiceDto);
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
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, req.user.id, updateServiceDto);
  }

  /**
   * Soft delete a service (sets isActive = false)
   * DELETE /api/services/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.servicesService.remove(id, req.user.id);
  }
}
