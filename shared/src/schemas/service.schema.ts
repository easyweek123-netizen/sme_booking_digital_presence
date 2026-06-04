import { z } from 'zod';
import { AvailabilityListSchema } from './availability.schema';
import { LocationDraftSchema } from './location.schema';
import { SERVICE_TYPES, PRICE_TYPES } from './types';

const HEX = /^#[0-9A-Fa-f]{6}$/;
function isCanonicalPriceString(value: string): boolean {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n.toFixed(2) === value;
}

export const ServiceCoreFieldsObject = z.object({
  type: z.enum(SERVICE_TYPES),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  capacity: z.number().int().min(1),
  durationMinutes: z.number().int().positive().optional(),
  pauseAfterMinutes: z.number().int().min(0).optional(),
  price: z.string().nullable().optional(),
  priceType: z.enum(PRICE_TYPES),
  color: z.string().regex(HEX).nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  categoryId: z.number().int().positive().nullable().optional(),
});

export const ServiceFieldsObject = ServiceCoreFieldsObject.extend({
  locationId: z.number().int().positive()
});

export const SERVICE_FORM_FIELD_KEYS = Object.keys(ServiceCoreFieldsObject.shape) as (keyof z.infer<
  typeof ServiceCoreFieldsObject
>)[];

const ServiceBaseObject = ServiceFieldsObject.extend({
  scheduleId: z.number().int().positive(),
});

function serviceFieldsRefine(
  v: z.infer<typeof ServiceCoreFieldsObject>,
  ctx: z.RefinementCtx,
): void {
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
  if ((v.priceType === 'FIXED' || v.priceType === 'FROM') && !v.price) {
    issue('price', 'price required for Fixed and From price types');
  }
  if ((v.priceType === 'FREE' || v.priceType === 'ON_REQUEST') && v.price) {
    if (!isCanonicalPriceString(v.price)) {
      issue(
        'price',
        'Price must be a non-negative amount with exactly 2 decimal places (e.g. 12.34)',
      );
    }
    issue('price', 'price must be null for FREE/ON_REQUEST');
  }
}

export const ServiceCreateSchema = ServiceBaseObject.superRefine(serviceFieldsRefine);
export type ServiceCreateInput = z.infer<typeof ServiceCreateSchema>;

export const ServiceFormFieldsSchema =
  ServiceCoreFieldsObject.superRefine(serviceFieldsRefine);

export const ServiceFormSchema = ServiceCoreFieldsObject.extend({
  availability: AvailabilityListSchema,
  location: LocationDraftSchema.nullable(),
}).superRefine((v, ctx) => {
  serviceFieldsRefine(v, ctx);
  const loc = v.location;
  if (loc == null) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['location'], message: 'Pick or create a location.' });
  } else if (loc.type === 'ADDRESS' && loc.data == null) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['location'], message: 'Enter an address.' });
  } else if (loc.type === 'PHONE' && !loc.data?.phoneNumber) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['location'], message: 'Enter a phone number.' });
  }
});

export type ServiceFormFieldsInput = z.infer<typeof ServiceFormFieldsSchema>;
export type ServiceFormInput = z.infer<typeof ServiceFormSchema>;

export const ServicePatchSchema = ServiceBaseObject.partial();
export type ServicePatchInput = z.infer<typeof ServicePatchSchema>;
