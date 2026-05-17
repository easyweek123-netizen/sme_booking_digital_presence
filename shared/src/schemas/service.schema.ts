import { z } from 'zod';
import { SERVICE_TYPES, PRICE_TYPES, LOCATION_TYPES } from './types';

const HEX = /^#[0-9A-Fa-f]{6}$/;
const PRICE = /^\d+\.\d{2}$/;

export const ServiceCreateSchema = z
  .object({
    type: z.enum(SERVICE_TYPES),
    name: z.string().min(1).max(200),
    description: z.string().max(2000).nullable().optional(),
    capacity: z.number().int().min(1),
    durationMinutes: z.number().int().positive(),
    pauseAfterMinutes: z.number().int().min(0).default(0),
    price: z.string().regex(PRICE).nullable().optional(),
    priceType: z.enum(PRICE_TYPES),
    locationType: z.enum(LOCATION_TYPES),
    locationMeta: z.record(z.unknown()).nullable().optional(),
    color: z.string().regex(HEX).nullable().optional(),
    photoUrl: z.string().url().nullable().optional(),
    categoryId: z.number().int().positive().nullable().optional(),
    scheduleId: z.number().int().positive(),
  })
  .superRefine((v, ctx) => {
    const issue = (path: string, message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

    if (v.type === 'APPOINTMENT' && v.capacity !== 1) {
      issue('capacity', 'APPOINTMENT requires capacity=1');
    }
    if (v.type === 'GROUP') {
      if (v.capacity < 2) issue('capacity', 'GROUP requires capacity>=2');
      if (v.pauseAfterMinutes !== 0)
        issue('pauseAfterMinutes', 'GROUP requires pauseAfterMinutes=0');
    }
    if ((v.priceType === 'FIXED' || v.priceType === 'FROM') && v.price == null) {
      issue('price', 'price required for FIXED/FROM');
    }
    if ((v.priceType === 'FREE' || v.priceType === 'ON_REQUEST') && v.price != null) {
      issue('price', 'price must be null for FREE/ON_REQUEST');
    }
  });
export type ServiceCreateInput = z.infer<typeof ServiceCreateSchema>;

const ServiceBaseObject = z.object({
  type: z.enum(SERVICE_TYPES),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  capacity: z.number().int().min(1),
  durationMinutes: z.number().int().positive(),
  pauseAfterMinutes: z.number().int().min(0).default(0),
  price: z.string().regex(PRICE).nullable().optional(),
  priceType: z.enum(PRICE_TYPES),
  locationType: z.enum(LOCATION_TYPES),
  locationMeta: z.record(z.unknown()).nullable().optional(),
  color: z.string().regex(HEX).nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  scheduleId: z.number().int().positive(),
});
export const ServicePatchSchema = ServiceBaseObject.partial();
export type ServicePatchInput = z.infer<typeof ServicePatchSchema>;
