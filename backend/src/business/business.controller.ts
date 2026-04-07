import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { FirebaseAuthGuard } from '../auth/guards';
import { OwnerResolverInterceptor, OwnerId } from '../common';
import { Business } from './entities/business.entity';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  /**
   * Create a new business with services
   * POST /api/business
   */
  @Post()
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(OwnerResolverInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @OwnerId() ownerId: number,
    @Body() createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    return this.businessService.create(ownerId, createBusinessDto);
  }

  /**
   * Get current owner's business
   * GET /api/business/me
   */
  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(OwnerResolverInterceptor)
  async getMyBusiness(@OwnerId() ownerId: number): Promise<Business> {
    return this.businessService.findByOwner(ownerId);
  }

  /**
   * Get business by slug (public)
   * GET /api/business/slug/:slug
   */
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string): Promise<Business> {
    return this.businessService.findBySlug(slug);
  }

  /**
   * Get business by ID
   * GET /api/business/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Business> {
    return this.businessService.findOne(id);
  }

  /**
   * Update business
   * PATCH /api/business/:id
   */
  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(OwnerResolverInterceptor)
  async update(
    @OwnerId() ownerId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    return this.businessService.update(id, ownerId, updateBusinessDto);
  }
}
