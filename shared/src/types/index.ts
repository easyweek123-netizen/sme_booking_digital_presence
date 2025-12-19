import { z } from 'zod';

// Import schemas
import {
  ExecutionModeSchema,
  PreviewContextSchema,
  ToolResultSchema,
  SuggestionSchema,
  MessageSchema,
  ChatResponseSchema,
  ActionResultStatusSchema,
  ActionResultSchema,
} from '../schemas/base';

import {
  ChatActionSchema,
  ServiceFormDataSchema,
  ServiceListItemSchema,
  ServiceCreateActionSchema,
  ServiceUpdateActionSchema,
  ServiceDeleteActionSchema,
  ServiceGetActionSchema,
} from '../schemas/actions';

// ─────────────────────────────────────────────────────────────────────────────
// Base Types
// ─────────────────────────────────────────────────────────────────────────────

/** Execution mode for actions */
export type ExecutionMode = z.infer<typeof ExecutionModeSchema>;

/** Preview context for canvas panel */
export type PreviewContext = z.infer<typeof PreviewContextSchema>;

/** Tool result returned by handlers */
export type ToolResult = z.infer<typeof ToolResultSchema>;

/** Chat suggestion */
export type Suggestion = z.infer<typeof SuggestionSchema>;

/** Chat message */
export type Message = z.infer<typeof MessageSchema>;

/** Chat API response */
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

/** Action result status */
export type ActionResultStatus = z.infer<typeof ActionResultStatusSchema>;

/** Action result sent by frontend after user confirms/cancels */
export type ActionResult = z.infer<typeof ActionResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Action Types (Proposals)
// ─────────────────────────────────────────────────────────────────────────────

/** Union of all chat action proposals */
export type ChatAction = z.infer<typeof ChatActionSchema>;

/** Alias for ChatAction - proposals are actions with tracking IDs */
export type ActionProposal = ChatAction;

/** Service form data */
export type ServiceFormData = z.infer<typeof ServiceFormDataSchema>;

/** Service list item */
export type ServiceListItem = z.infer<typeof ServiceListItemSchema>;

/** Service create action */
export type ServiceCreateAction = z.infer<typeof ServiceCreateActionSchema>;

/** Service update action */
export type ServiceUpdateAction = z.infer<typeof ServiceUpdateActionSchema>;

/** Service delete action */
export type ServiceDeleteAction = z.infer<typeof ServiceDeleteActionSchema>;

/** Service get action */
export type ServiceGetAction = z.infer<typeof ServiceGetActionSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Utility Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract action type by its 'type' discriminant
 * Usage: ExtractAction<ChatAction, 'service:create'>
 */
export type ExtractAction<T extends ChatAction, K extends T['type']> = Extract<T, { type: K }>;

/**
 * Get all action type literals
 */
export type ActionType = ChatAction['type'];

