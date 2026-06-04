import { z } from 'zod';
import { ServiceFieldsObject } from '@bookeasy/shared';

/**
 * Fields the AI is allowed to seed via chat tools.
 * Subset of ServiceFieldsObject — capacity, location, availability, color
 * are filled in by the user inside ServiceForm.
 */
export const ServiceToolSeedSchema = ServiceFieldsObject.pick({
  name: true,
  description: true,
  type: true,
  durationMinutes: true,
  price: true,
  priceType: true,
  capacity: true,
  pauseAfterMinutes: true,
  color: true,
}).partial();

export type ServiceToolSeed = z.infer<typeof ServiceToolSeedSchema>;

const lookupRefine = (d: { id?: number; name?: string }) =>
  d.id !== undefined || d.name !== undefined;
const lookupMessage = { message: 'Either id or name is required' };

export const ServiceUpdateArgsSchema = z
  .object({
    id: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Service ID (preferred — from services_list).'),
    name: z
      .string()
      .optional()
      .describe('Service name (fallback when ID unknown).'),
  })
  .merge(ServiceToolSeedSchema)
  .refine(lookupRefine, lookupMessage);

export const ServiceLookupArgsSchema = z
  .object({
    id: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Service ID (preferred).'),
    name: z
      .string()
      .optional()
      .describe('Service name (fallback when ID unknown).'),
  })
  .refine(lookupRefine, lookupMessage);

export type ServiceUpdateArgs = z.infer<typeof ServiceUpdateArgsSchema>;
export type ServiceLookupArgs = z.infer<typeof ServiceLookupArgsSchema>;
