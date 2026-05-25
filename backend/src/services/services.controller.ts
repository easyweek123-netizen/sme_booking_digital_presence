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
import { ServicesService } from './services.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ServiceCreateSchema, ServicePatchSchema } from '@bookeasy/shared';
import type { ServiceCreateInput, ServicePatchInput } from '@bookeasy/shared';
import { FirebaseAuthGuard } from '../auth/guards';
import {
  BusinessId,
  BusinessOwnershipGuard,
  OwnerResolverGuard,
} from '../common';
import { Entitlement, EntitlementGuard } from '../entitlements';
import { Service } from './entities/service.entity';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(
    FirebaseAuthGuard,
    OwnerResolverGuard,
    BusinessOwnershipGuard,
    EntitlementGuard,
  )
  @Entitlement('service.create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @BusinessId() businessId: number,
    @Body(new ZodValidationPipe(ServiceCreateSchema)) body: ServiceCreateInput,
  ): Promise<Service> {
    return this.servicesService.create(businessId, body);
  }

  @Get('business/:businessId')
  async findByBusiness(
    @Param('businessId', ParseIntPipe) businessId: number,
  ): Promise<Service[]> {
    return this.servicesService.findByBusiness(businessId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(
    FirebaseAuthGuard,
    OwnerResolverGuard,
    BusinessOwnershipGuard,
    EntitlementGuard,
  )
  @Entitlement('service.create', {
    when: (req) =>
      (req.body as { isActive?: boolean } | undefined)?.isActive === true,
  })
  async update(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(ServicePatchSchema)) body: ServicePatchInput,
  ): Promise<Service> {
    return this.servicesService.update(id, businessId, body);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.servicesService.remove(id, businessId);
  }
}
