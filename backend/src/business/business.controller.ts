import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Business } from './entities/business.entity';
import type { RequestWithUser } from '../common';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  /**
   * Create a new business with services
   * POST /api/business
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: RequestWithUser,
    @Body() createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    return this.businessService.create(req.user.id, createBusinessDto);
  }

  /**
   * Get current owner's business
   * GET /api/business/me
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyBusiness(@Request() req: RequestWithUser): Promise<Business> {
    return this.businessService.findByOwner(req.user.id);
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
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    return this.businessService.update(id, req.user.id, updateBusinessDto);
  }
}
