import { z } from 'zod';

export const AddressInputSchema = z.object({
  displayName: z.string(),
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string(),
  postalCode: z.string().nullable(),
  countryCode: z.string(),
  countryName: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
});

export const PhoneInputSchema = z.object({
  phoneNumber: z.string(),
});

export const OnlineInputSchema = z.object({
  calendarId: z.number().int().positive(),
});
export type OnlineInput = z.infer<typeof OnlineInputSchema>;

export const ActiveLocationKindSchema = z.enum(['ADDRESS', 'PHONE', 'ONLINE']);

export type AddressInput = z.infer<typeof AddressInputSchema>;
export type PhoneInput = z.infer<typeof PhoneInputSchema>;
export type ActiveLocationKind = z.infer<typeof ActiveLocationKindSchema>;

/**
 * Payload accepted by the location-creation API. Built on demand from form
 * fields by useSaveService — not a form field itself.
 */
export type CreatingLocation =
  | { type: 'ADDRESS'; data: AddressInput }
  | { type: 'PHONE';   data: PhoneInput }
  | { type: 'ONLINE' };

export const CreateLocationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ADDRESS'), data: AddressInputSchema }),
  z.object({ type: z.literal('PHONE'),   data: PhoneInputSchema }),
  z.object({ type: z.literal('ONLINE'), data: OnlineInputSchema }),
]);

export type CreateLocationDto = z.infer<typeof CreateLocationSchema>;

export const LocationDraftSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('ADDRESS'),
    locationId: z.number().int().positive().nullable(),
    data: AddressInputSchema.nullable(),
  }),
  z.object({
    type: z.literal('PHONE'),
    locationId: z.number().int().positive().nullable(),
    data: PhoneInputSchema.nullable(),
  }),
  z.object({
    type: z.literal('ONLINE'),
    locationId: z.number().int().positive().nullable(),
    data: OnlineInputSchema.optional(),
  }),
]);

export type LocationDraft = z.infer<typeof LocationDraftSchema>;
