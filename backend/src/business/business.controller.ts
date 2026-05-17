import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { FirebaseAuthGuard } from '../auth/guards';
import {
  BusinessId,
  BusinessOwnershipGuard,
  OwnerId,
  OwnerResolverGuard,
} from '../common';
import { Business } from './entities/business.entity';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @OwnerId() ownerId: number,
    @Body() createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    return this.businessService.create(ownerId, createBusinessDto);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
  async findMyBusiness(@BusinessId() businessId: number): Promise<Business> {
    return this.businessService.findOne(businessId);
  }

  @Patch()
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
  async update(
    @BusinessId() businessId: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    return this.businessService.update(businessId, updateBusinessDto);
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string): Promise<Business> {
    return this.businessService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Business> {
    return this.businessService.findOne(id);
  }
}
