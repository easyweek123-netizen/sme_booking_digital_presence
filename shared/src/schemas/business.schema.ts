import { z } from 'zod';

const HEX = /^#[0-9A-Fa-f]{6}$/;
const TZ = /^[A-Za-z]+\/[A-Za-z_+\-/]+$|^UTC$/;

export const BusinessPatchSchema = z
  .object({
    name: z.string().min(1).max(200),
    description: z.string(),
    website: z.string().max(255),
    instagram: z.string().max(100),
    logoUrl: z.string().max(500),
    brandColor: z
      .string()
      .regex(HEX, 'Brand color must be a valid hex color (e.g., #FF5733)'),
    coverImageUrl: z.string().max(500).nullable(),
    aboutContent: z.string().max(5000).nullable(),
    timezone: z
      .string()
      .max(64)
      .regex(TZ, 'Timezone must be a valid IANA identifier (e.g., Europe/Vienna)'),
    showNextAvailable: z.boolean(),
    showWeeklyHours: z.boolean(),
  })
  .partial();

export type BusinessPatchInput = z.infer<typeof BusinessPatchSchema>;
