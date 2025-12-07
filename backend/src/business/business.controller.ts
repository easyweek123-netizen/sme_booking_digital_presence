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
import { FirebaseAuthGuard } from '../auth/guards';
import { Business } from './entities/business.entity';
import type { RequestWithFirebaseUser } from '../common';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  /**
   * Create a new business with services
   * POST /api/business
   */
  @Post()
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: RequestWithFirebaseUser,
    @Body() createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    return this.businessService.create(req.firebaseUser, createBusinessDto);
  }

  /**
   * Get current owner's business
   * GET /api/business/me
   */
  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async getMyBusiness(@Request() req: RequestWithFirebaseUser): Promise<Business> {
    return this.businessService.findByOwner(req.firebaseUser);
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
  async update(
    @Request() req: RequestWithFirebaseUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    return this.businessService.update(id, req.firebaseUser, updateBusinessDto);
  }
}
