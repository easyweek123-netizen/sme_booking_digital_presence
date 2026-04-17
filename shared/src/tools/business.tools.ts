import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Working Hours Schema (used in business_update args and profile)
// ─────────────────────────────────────────────────────────────────────────────

const DayScheduleSchema = z.object({
  isOpen: z.boolean().describe('Whether the business is open on this day'),
  openTime: z.string().describe('Opening time in HH:MM format (e.g. "09:00")'),
  closeTime: z.string().describe('Closing time in HH:MM format (e.g. "17:00")'),
});

export const WorkingHoursSchema = z.object({
  monday: DayScheduleSchema,
  tuesday: DayScheduleSchema,
  wednesday: DayScheduleSchema,
  thursday: DayScheduleSchema,
  friday: DayScheduleSchema,
  saturday: DayScheduleSchema,
  sunday: DayScheduleSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Business Profile Schema (read-only shape returned by business_get)
// ─────────────────────────────────────────────────────────────────────────────

export const BusinessProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  website: z.string().nullable(),
  instagram: z.string().nullable(),
  logoUrl: z.string().nullable(),
  brandColor: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  aboutContent: z.string().nullable(),
  workingHours: WorkingHoursSchema.nullable(),
  slug: z.string(),
  businessType: z.string().nullable(),
});

export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Field groups (single source of truth for UI section composition)
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_PROFILE_FIELDS = ['name', 'description', 'phone', 'address', 'city', 'website', 'instagram'] as const;
export const BUSINESS_BRANDING_FIELDS = ['logoUrl', 'brandColor', 'coverImageUrl'] as const;
export const BUSINESS_ABOUT_FIELDS = ['aboutContent'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Business Update Args (tool arguments -- all optional, at least one required)
// ─────────────────────────────────────────────────────────────────────────────

export const BusinessUpdateArgsSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .optional()
      .describe(
        'Business name. When proposing a rename, use the new name; otherwise omit — current name is pre-filled in the form.',
      ),
    description: z
      .string()
      .optional()
      .describe(
        'Short 1–2 sentence tagline for the hero section. Plain text only, not HTML. Empty string if unknown. user edits in the form.',
      ),
    phone: z
      .string()
      .optional()
      .describe('Contact phone number. Empty string if unknown — user fills in the form.'),
    address: z
      .string()
      .optional()
      .describe('Street address. Empty string if unknown — user fills in the form.'),
    city: z
      .string()
      .optional()
      .describe('City. Empty string if unknown — user fills in the form.'),
    website: z
      .string()
      .optional()
      .describe('Website URL. Empty string if not provided — user fills in the form.'),
    instagram: z
      .string()
      .optional()
      .describe('Instagram handle. Empty string if not provided — user fills in the form.'),
    logoUrl: z
      .string()
      .optional()
      .describe('Logo image URL. Empty string — user fills in the form.'),
    brandColor: z
      .string()
      .optional()
      .describe(
        'Brand color hex (e.g. #FF5733). Pick a sensible default for the business type, or empty string for the user to choose via color picker in the form.',
      ),
    coverImageUrl: z
      .string()
      .optional()
      .describe('Cover image URL for booking page header. Empty string — user fills in the form.'),
    workingHours: WorkingHoursSchema
      .optional()
      .describe(
        'Weekly opening hours — all 7 days. Use sensible defaults for the business type (e.g. salons: Tue–Sat 09:00–18:00; restaurants: Mon–Sun 11:00–22:00). Closed days: isOpen=false. User can adjust in the form.',
      ),
    aboutContent: z
      .string()
      .optional()
      .describe(
        'Long About section for the booking page. HTML only (<h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <a>). ' +
        'Only propose after description is set or when the user explicitly asks for an about/story section. Put HTML only in this argument — never echo it in chat.',
      ),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });

export type BusinessUpdateArgs = z.infer<typeof BusinessUpdateArgsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Business Update Action (proposal from AI to frontend)
// ─────────────────────────────────────────────────────────────────────────────

export const BusinessUpdateActionSchema = z.object({
  type: z.literal('business:update'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  businessId: z.number(),
  updates: z.record(z.unknown()),
  current: z.record(z.unknown()),
});

export type BusinessUpdateAction = z.infer<typeof BusinessUpdateActionSchema>;
