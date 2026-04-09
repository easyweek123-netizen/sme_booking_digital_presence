import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Service Input Schema (Single Source of Truth)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Service input data schema - used by:
 * - AI tool arguments (what AI sends when calling services_create/update)
 * - Frontend forms (ServiceForm component)
 * - API payloads (create/update service endpoints)
 *
 * Descriptions are used by AI to understand each parameter.
 */
export const ServiceInputSchema = z.object({
  name: z
    .string()
    .min(1, 'Service name is required')
    .describe('Service name (e.g., "Haircut", "60-min Massage")'),
  price: z
    .number()
    .nonnegative('Price must be non-negative')
    .describe('Price in dollars (e.g., 50)'),
  durationMinutes: z
    .number()
    .int()
    .positive('Duration must be a positive integer')
    .describe('Duration in minutes (e.g., 30, 60, 90)'),
  description: z
    .string()
    .optional()
    .describe('Optional description of the service'),
  imageUrl: z
    .string()
    .nullable()
    .optional()
    .describe('Optional image URL for the service'),
});

/** Service input type - inferred from schema */
export type ServiceInput = z.infer<typeof ServiceInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service List Item Schema (for display)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Service item with ID for display purposes
 */
export const ServiceListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  durationMinutes: z.number(),
  description: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
});

export type ServiceListItem = z.infer<typeof ServiceListItemSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service Action Schemas (Proposals from AI to Frontend)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Action: Create a new service
 * Sent to frontend when AI prepares a service creation proposal
 */
export const ServiceCreateActionSchema = z.object({
  type: z.literal('service:create'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  businessId: z.number(),
  service: ServiceInputSchema,
});

/**
 * Action: Update an existing service
 * Sent to frontend when AI prepares a service update proposal
 */
export const ServiceUpdateActionSchema = z.object({
  type: z.literal('service:update'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  resolvedId: z.number(),
  serviceName: z.string(),
  service: ServiceInputSchema,
});

/**
 * Action: Delete a service
 * Sent to frontend when AI prepares a service deletion proposal
 */
export const ServiceDeleteActionSchema = z.object({
  type: z.literal('service:delete'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  resolvedId: z.number(),
  name: z.string(),
});

/**
 * Action: Display a service (read-only)
 * Used when AI wants to show service details without modification
 */
export const ServiceGetActionSchema = z.object({
  type: z.literal('service:get'),
  proposalId: z.string().uuid(),
  executionMode: z.literal('auto').default('auto'),
  resolvedId: z.number(),
  service: ServiceListItemSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Types (inferred from schemas)
// ─────────────────────────────────────────────────────────────────────────────

export type ServiceCreateAction = z.infer<typeof ServiceCreateActionSchema>;
export type ServiceUpdateAction = z.infer<typeof ServiceUpdateActionSchema>;
export type ServiceDeleteAction = z.infer<typeof ServiceDeleteActionSchema>;
export type ServiceGetAction = z.infer<typeof ServiceGetActionSchema>;

/** All service actions union */
export type ServiceAction =
  | ServiceCreateAction
  | ServiceUpdateAction
  | ServiceDeleteAction
  | ServiceGetAction;
