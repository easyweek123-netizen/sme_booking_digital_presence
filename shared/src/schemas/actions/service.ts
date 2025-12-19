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
});

// ─────────────────────────────────────────────────────────────────────────────
// Service Action Schemas (Proposals)
// Each action includes a proposalId for confirmation tracking
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Action: Create a new service
 * Shows form in canvas for user to confirm
 */
export const ServiceCreateActionSchema = z.object({
  type: z.literal('service:create'),
  
  /** Unique proposal ID for confirmation tracking */
  proposalId: z.string().uuid(),
  
  /** How this action should be executed */
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  
  /** Business ID to create service for */
  businessId: z.number().optional(),
  
  /** Pre-filled service data from AI */
  service: ServiceFormDataSchema,
});

/**
 * Action: Update an existing service
 * Shows form pre-filled with existing + updated values
 */
export const ServiceUpdateActionSchema = z.object({
  type: z.literal('service:update'),
  
  /** Unique proposal ID for confirmation tracking */
  proposalId: z.string().uuid(),
  
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  
  /** Backend-resolved service ID (from name lookup) */
  resolvedId: z.number(),
  
  /** Original service name passed by AI */
  serviceName: z.string(),
  
  /** Updated service data */
  service: ServiceFormDataSchema,
});

/**
 * Action: Delete a service
 * Shows confirmation dialog
 */
export const ServiceDeleteActionSchema = z.object({
  type: z.literal('service:delete'),
  
  /** Unique proposal ID for confirmation tracking */
  proposalId: z.string().uuid(),
  
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  
  /** Backend-resolved service ID (from name lookup) */
  resolvedId: z.number(),
  
  /** Service name for confirmation message */
  name: z.string(),
});

/**
 * Action: Display a service (read-only)
 * Shows service card in canvas
 */
export const ServiceGetActionSchema = z.object({
  type: z.literal('service:get'),
  
  /** Unique proposal ID for tracking */
  proposalId: z.string().uuid(),
  
  /** Always auto for display-only actions */
  executionMode: z.literal('auto').default('auto'),
  
  /** Backend-resolved service ID */
  resolvedId: z.number(),
  
  /** Full service data to display */
  service: ServiceListItemSchema,
});

