import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Service Tools
// ─────────────────────────────────────────────────────────────────────────────

export * from './service.tools';
import {
  ServiceCreateActionSchema,
  ServiceUpdateActionSchema,
  ServiceDeleteActionSchema,
  ServiceGetActionSchema,
} from './service.tools';

// ─────────────────────────────────────────────────────────────────────────────
// Chat Action Union
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Union of all possible chat actions.
 * Add new action schemas here as you create them.
 */
export const ChatActionSchema = z.discriminatedUnion('type', [
  // Service actions
  ServiceCreateActionSchema,
  ServiceUpdateActionSchema,
  ServiceDeleteActionSchema,
  ServiceGetActionSchema,
  // Future: BookingActionSchema, CustomerActionSchema, etc.
]);

/** Union type of all chat actions */
export type ChatAction = z.infer<typeof ChatActionSchema>;

/** Get action type literal */
export type ActionType = ChatAction['type'];

/** Extract specific action by type */
export type ExtractAction<T extends ChatAction, K extends T['type']> = Extract<T, { type: K }>;

// ─────────────────────────────────────────────────────────────────────────────
// Base Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ExecutionModeSchema = z.enum(['confirm', 'auto']);
export type ExecutionMode = z.infer<typeof ExecutionModeSchema>;

export const PreviewContextSchema = z.enum([
  'booking_page',
  'services',
  'bookings',
  'clients',
]);
export type PreviewContext = z.infer<typeof PreviewContextSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Tool Result Schema
// ─────────────────────────────────────────────────────────────────────────────

export const ToolResultSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.record(z.unknown()).optional(),
  proposals: z.array(ChatActionSchema).optional(),
  previewContext: PreviewContextSchema.optional(),
  error: z.string().optional(),
});

export type ToolResult = z.infer<typeof ToolResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Chat Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const SuggestionSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string().optional(),
  variant: z.enum(['default', 'skip']).optional(),
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

export const MessageSchema = z.object({
  role: z.enum(['bot', 'user']),
  content: z.string(),
  suggestions: z.array(SuggestionSchema).optional(),
  proposals: z.array(ChatActionSchema).optional(),
  previewContext: PreviewContextSchema.optional(),
});
export type Message = z.infer<typeof MessageSchema>;

export const ChatResponseSchema = z.object({
  role: z.literal('bot'),
  content: z.string(),
  proposals: z.array(ChatActionSchema).optional(),
  previewContext: PreviewContextSchema.optional(),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Action Result (confirmation flow)
// ─────────────────────────────────────────────────────────────────────────────

export const ActionResultStatusSchema = z.enum(['confirmed', 'cancelled', 'modified']);
export type ActionResultStatus = z.infer<typeof ActionResultStatusSchema>;

export const ActionResultSchema = z.object({
  proposalId: z.string().uuid(),
  status: ActionResultStatusSchema,
  result: z.record(z.unknown()).optional(),
});
export type ActionResult = z.infer<typeof ActionResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (re-exported with different names to avoid conflicts)
// ─────────────────────────────────────────────────────────────────────────────

export { createProposal } from './helpers';
export { ToolResult as ToolResultHelpers } from './helpers';
export type { ToolResultType, ToolResultSuccess, ToolResultError } from './helpers';

