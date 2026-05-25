import { z } from 'zod';

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;

export const BookingCreateSchema = z.object({
  serviceId: z.number().int().positive(),
  date: z.string().regex(YMD),
  startTime: z.string().regex(HHMM),
  customerName: z.string().min(1).max(100),
  customerEmail: z.string().email().max(255),
  notes: z.string().max(2000).nullable().optional(),
});
export type BookingCreateInput = z.infer<typeof BookingCreateSchema>;

export const AvailabilityQuerySchema = z.object({
  from: z.string().regex(YMD),
  to: z.string().regex(YMD),
});
export type AvailabilityQuery = z.infer<typeof AvailabilityQuerySchema>;
