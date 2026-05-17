import { z } from 'zod';
import { AvailabilitySchema } from './availability.schema';

const YMD = /^\d{4}-\d{2}-\d{2}$/;

export const ScheduleCreateSchema = z.object({
  name: z.string().min(1).max(120),
  timezone: z.string().max(64).nullable().optional(),
  availability: z.array(AvailabilitySchema).default([]),
});
export type ScheduleCreateInput = z.infer<typeof ScheduleCreateSchema>;

export const SchedulePatchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  timezone: z.string().max(64).nullable().optional(),
  availability: z.array(AvailabilitySchema).optional(),
});
export type SchedulePatchInput = z.infer<typeof SchedulePatchSchema>;

export const SlotsQuerySchema = z.object({
  serviceId: z.coerce.number().int().positive(),
  from: z.string().regex(YMD),
  to: z.string().regex(YMD),
});
export type SlotsQuery = z.infer<typeof SlotsQuerySchema>;
