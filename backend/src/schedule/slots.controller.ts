import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ScheduleService } from './schedule.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { SlotsQuerySchema, type SlotsQuery } from '@bookeasy/shared';

@Controller('slots')
export class SlotsController {
  constructor(private readonly schedule: ScheduleService) {}

  /** Public — bookable time slots for a service over a date range. */
  @Get()
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  async list(@Query(new ZodValidationPipe(SlotsQuerySchema)) q: SlotsQuery) {
    return this.schedule.getSlots(q.serviceId, { from: q.from, to: q.to });
  }
}
