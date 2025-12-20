import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Service Data Schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Service form data for create/update operations
 */
export const ServiceFormDataSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  price: z.number().nonnegative('Price must be positive'),
  durationMinutes: z.number().int().positive('Duration must be positive'),
  description: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
});

/**
 * Service item for display (includes ID)
 */
export const ServiceListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  durationMinutes: z.number(),
  description: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Service Action Schemas (Proposals)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Action: Create a new service
 */
export const ServiceCreateActionSchema = z.object({
  type: z.literal('service:create'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  businessId: z.number().optional(),
  service: ServiceFormDataSchema,
});

/**
 * Action: Update an existing service
 */
export const ServiceUpdateActionSchema = z.object({
  type: z.literal('service:update'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  resolvedId: z.number(),
  serviceName: z.string(),
  service: ServiceFormDataSchema,
});

/**
 * Action: Delete a service
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

export type ServiceFormData = z.infer<typeof ServiceFormDataSchema>;
export type ServiceListItem = z.infer<typeof ServiceListItemSchema>;
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

