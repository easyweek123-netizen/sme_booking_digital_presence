import { z } from 'zod';
import { ChatActionSchema } from './actions';

/**
 * Execution mode for actions
 * - 'confirm': Show in canvas, user must confirm (default)
 * - 'auto': Execute immediately, show result
 */
export const ExecutionModeSchema = z.enum(['confirm', 'auto']);

/**
 * Preview context - determines what's shown in the Preview tab
 */
export const PreviewContextSchema = z.enum([
  'booking_page',
  'services',
  'bookings',
  'clients',
]);

/**
 * Result returned by a tool handler
 * Includes proposals for frontend rendering
 */
export const ToolResultSchema = z.object({
  /** Whether the tool execution was successful */
  success: z.boolean(),
  
  /** Message for AI to use in formulating response */
  message: z.string().optional(),
  
  /** Structured data for AI context (e.g., service list with IDs) */
  data: z.record(z.unknown()).optional(),
  
  /** Proposals for frontend to render in canvas */
  proposals: z.array(ChatActionSchema).optional(),
  
  /** Switch preview tab to specific context */
  previewContext: PreviewContextSchema.optional(),
  
  /** Error message if success is false */
  error: z.string().optional(),
});

/**
 * Chat suggestion shown to user
 */
export const SuggestionSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string().optional(),
  variant: z.enum(['default', 'skip']).optional(),
});

/**
 * Chat message structure
 */
export const MessageSchema = z.object({
  role: z.enum(['bot', 'user']),
  content: z.string(),
  suggestions: z.array(SuggestionSchema).optional(),
  proposals: z.array(ChatActionSchema).optional(),
  previewContext: PreviewContextSchema.optional(),
});

/**
 * Chat response from API
 */
export const ChatResponseSchema = z.object({
  role: z.literal('bot'),
  content: z.string(),
  proposals: z.array(ChatActionSchema).optional(),
  previewContext: PreviewContextSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Action Result (for confirmation flow)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Status of a user's response to a proposal
 */
export const ActionResultStatusSchema = z.enum(['confirmed', 'cancelled', 'modified']);

/**
 * Sent by frontend after user confirms/cancels a proposal
 */
export const ActionResultSchema = z.object({
  /** The proposal ID being responded to */
  proposalId: z.string().uuid(),
  
  /** What the user did */
  status: ActionResultStatusSchema,
  
  /** Optional result data (e.g., modified values) */
  result: z.record(z.unknown()).optional(),
});

