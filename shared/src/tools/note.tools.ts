import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Note Create Args (AI tool input)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Arguments for the notes_create tool.
 * Supports customer resolution by ID (preferred) or name (fallback).
 */
export const NotesCreateArgsSchema = z
  .object({
    content: z
      .string()
      .min(1, 'Note content is required')
      .describe('The note text to add'),
    customerId: z
      .number()
      .optional()
      .describe('Customer ID (preferred — use id from customers_list)'),
    customerName: z
      .string()
      .optional()
      .describe('Customer name (fallback if ID not available)'),
    bookingId: z
      .number()
      .optional()
      .describe('Booking ID to attach the note to — MUST be a real ID from customers_list or customers_get results. Never guess or invent a booking ID.'),
  })
  .refine(
    (data) =>
      data.customerId !== undefined ||
      data.customerName !== undefined ||
      data.bookingId !== undefined,
    {
      message:
        'At least one of customerId, customerName, or bookingId is required',
    },
  );

export type NotesCreateArgs = z.infer<typeof NotesCreateArgsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Note List Filters (AI tool input)
// ─────────────────────────────────────────────────────────────────────────────

export const NotesListFiltersSchema = z
  .object({
    customerId: z
      .number()
      .optional()
      .describe('Filter notes by customer ID'),
    bookingId: z
      .number()
      .optional()
      .describe('Filter notes by booking ID'),
  })
  .refine(
    (data) => data.customerId !== undefined || data.bookingId !== undefined,
    { message: 'Either customerId or bookingId is required' },
  );

export type NotesListFilters = z.infer<typeof NotesListFiltersSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Note Update Args (AI tool input)
// ─────────────────────────────────────────────────────────────────────────────

export const NotesUpdateArgsSchema = z.object({
  id: z
    .number()
    .describe('Note ID (from notes_list)'),
  content: z
    .string()
    .min(1, 'Note content is required')
    .describe('Updated note content'),
});

export type NotesUpdateArgs = z.infer<typeof NotesUpdateArgsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Note Delete Args (AI tool input)
// ─────────────────────────────────────────────────────────────────────────────

export const NotesDeleteArgsSchema = z.object({
  id: z
    .number()
    .describe('Note ID (from notes_list)'),
});

export type NotesDeleteArgs = z.infer<typeof NotesDeleteArgsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Note List Item Schema (returned data shape)
// ─────────────────────────────────────────────────────────────────────────────

export const NoteListItemSchema = z.object({
  id: z.number(),
  content: z.string(),
  customerId: z.number().nullable(),
  bookingId: z.number().nullable(),
  createdAt: z.string(),
});

export type NoteListItem = z.infer<typeof NoteListItemSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Note Action Schemas (Proposals from AI to Frontend)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Action: Create a new note
 * Sent to frontend when AI prepares a note creation proposal
 */
export const NoteCreateActionSchema = z.object({
  type: z.literal('note:create'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  content: z.string(),
  customerId: z.number().nullable(),
  bookingId: z.number().nullable(),
  customerName: z.string().optional(),
});

/**
 * Action: Update an existing note
 * Sent to frontend when AI prepares a note update proposal
 */
export const NoteUpdateActionSchema = z.object({
  type: z.literal('note:update'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  resolvedId: z.number(),
  content: z.string(),
  customerName: z.string().optional(),
});

/**
 * Action: Delete a note
 * Sent to frontend when AI prepares a note deletion proposal
 */
export const NoteDeleteActionSchema = z.object({
  type: z.literal('note:delete'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  resolvedId: z.number(),
  contentPreview: z.string(),
  customerName: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Types (inferred from schemas)
// ─────────────────────────────────────────────────────────────────────────────

export type NoteCreateAction = z.infer<typeof NoteCreateActionSchema>;
export type NoteUpdateAction = z.infer<typeof NoteUpdateActionSchema>;
export type NoteDeleteAction = z.infer<typeof NoteDeleteActionSchema>;

/** All note actions union */
export type NoteAction =
  | NoteCreateAction
  | NoteUpdateAction
  | NoteDeleteAction;
