import { z } from 'zod';
import { LocationDraftSchema } from './location.schema';
import { AvailabilityListSchema } from './availability.schema';

// Mirrors frontend TEXT_LIMITS.BUSINESS_TAGLINE.
const TAGLINE_MAX = 120;

const optionalUrl = z.union([
  z.literal(''),
  z.string().url('Enter a valid URL (https://…)'),
]);

const INSTAGRAM_RE = /^(@[\w.]+|https?:\/\/(www\.)?instagram\.com\/[\w.]+\/?)$/;
const optionalInstagram = z.union([
  z.literal(''),
  z.string().regex(INSTAGRAM_RE, 'Use @handle or a full instagram.com URL'),
]);

const BasicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Business name is required')
    .max(80, 'Maximum 80 characters'),
  description: z.string().max(TAGLINE_MAX, `Maximum ${TAGLINE_MAX} characters`),
  logoUrl: optionalUrl,
  brandColor: z.string().min(1, 'Pick a brand color'),
  coverImageUrl: optionalUrl,
  website: optionalUrl,
  instagram: optionalInstagram,
});

const AboutSchema = z.object({
  aboutContent: z.string(), // free TipTap HTML, no length cap
});

// Location: we validate the shape (3 keys, correct types) but NOT each row's
// contents. Per-row validation happens at save time in toDto() — empty/partial
// rows are silently dropped there, which matches the "add a row, fill it
// later" UX without firing onBlur errors on every keystroke.
const LocationSchema = z.object({
  byType: z.object({
    ADDRESS: z.array(LocationDraftSchema),
    PHONE: z.array(LocationDraftSchema),
    ONLINE: LocationDraftSchema.nullable(),
  }),
});

const VisibilitySchema = z.object({
  showNextAvailable: z.boolean(),
  showWeeklyHours: z.boolean(),
});

const AvailabilitySectionSchema = z.object({
  hours: AvailabilityListSchema,
  visibility: VisibilitySchema,
});

export const WebsiteFormSchema = z.object({
  basic: BasicSchema,
  about: AboutSchema,
  location: LocationSchema,
  availability: AvailabilitySectionSchema,
});

export type WebsiteFormInput = z.infer<typeof WebsiteFormSchema>;
