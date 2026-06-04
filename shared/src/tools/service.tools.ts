import { z } from 'zod';
import { ServiceFieldsObject } from '../schemas/service.schema';
import { SERVICE_TYPES, PRICE_TYPES } from '../schemas/types';

// ─────────────────────────────────────────────────────────────────────────────
// Service List Item Schema (for display / AI context)
// ─────────────────────────────────────────────────────────────────────────────

export const ServiceListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(SERVICE_TYPES),
  description: z.string().nullable().optional(),
  durationMinutes: z.number(),
  price: z.string().nullable().optional(),
  priceType: z.enum(PRICE_TYPES),
  capacity: z.number().int(),
  isActive: z.boolean(),
  imageUrl: z.string().nullable().optional(),
});

export type ServiceListItem = z.infer<typeof ServiceListItemSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Seed payload schema (cross-wire: backend tool → frontend form initialValues)
// ─────────────────────────────────────────────────────────────────────────────

const ServiceSeedPayloadSchema = ServiceFieldsObject.partial();

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
  suggestedEdits: ServiceSeedPayloadSchema.optional(),
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
  suggestedEdits: ServiceSeedPayloadSchema.optional(),
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
 * Schema kept for union completeness; no tool emits this anymore (services_get is data-only).
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
