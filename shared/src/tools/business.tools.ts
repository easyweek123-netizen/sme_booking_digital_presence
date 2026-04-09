import { z } from 'zod';

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
      .describe('Business name'),
    description: z
      .string()
      .optional()
      .describe('Short business description'),
    phone: z
      .string()
      .optional()
      .describe('Contact phone number'),
    address: z
      .string()
      .optional()
      .describe('Street address'),
    city: z
      .string()
      .optional()
      .describe('City'),
    website: z
      .string()
      .optional()
      .describe('Website URL'),
    instagram: z
      .string()
      .optional()
      .describe('Instagram handle'),
    logoUrl: z
      .string()
      .optional()
      .describe('Logo image URL'),
    brandColor: z
      .string()
      .optional()
      .describe('Brand color as hex (e.g. #FF5733)'),
    coverImageUrl: z
      .string()
      .optional()
      .describe('Cover image URL for booking page header'),
    aboutContent: z
      .string()
      .optional()
      .describe(
        'About section for the public booking page. MUST be formatted as HTML using these tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <a>. ' +
        'Write compelling, well-structured content that tells the business story. Include sections like welcome heading, what they offer, why choose them, and optionally a customer testimonial in <blockquote>. ' +
        'Be creative and professional -- this is the first thing potential customers read. Never send plain text without HTML tags.',
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
