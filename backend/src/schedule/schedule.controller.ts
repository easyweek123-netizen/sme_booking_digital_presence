import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  ScheduleCreateSchema,
  SchedulePatchSchema,
  type ScheduleCreateInput,
  type SchedulePatchInput,
} from '@bookeasy/shared';
import { FirebaseAuthGuard } from '../auth/guards';
import {
  BusinessId,
  BusinessOwnershipGuard,
  OwnerResolverGuard,
} from '../common';

@Controller('schedules')
@UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
export class ScheduleController {
  constructor(private readonly schedule: ScheduleService) {}

  @Get()
  async list(@BusinessId() businessId: number) {
    return this.schedule.listForBusiness(businessId);
  }

  @Get(':id')
  async get(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.schedule.findForBusiness(id, businessId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @BusinessId() businessId: number,
    @Body(new ZodValidationPipe(ScheduleCreateSchema))
    body: ScheduleCreateInput,
  ) {
    return this.schedule.createForBusiness(businessId, body);
  }

  @Patch(':id')
  async update(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(SchedulePatchSchema)) body: SchedulePatchInput,
  ) {
    return this.schedule.updateForBusiness(id, businessId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.schedule.removeForBusiness(id, businessId);
  }
}
