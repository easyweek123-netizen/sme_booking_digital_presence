import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Booking status (aligned with backend BookingStatus enum)
// ─────────────────────────────────────────────────────────────────────────────

export const BookingStatusSchema = z
  .enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'])
  .describe(
    'Booking status: PENDING (awaiting confirmation), CONFIRMED, CANCELLED, COMPLETED, NO_SHOW',
  );

export type BookingStatusValue = z.infer<typeof BookingStatusSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// AI tool args: list bookings filters
// ─────────────────────────────────────────────────────────────────────────────

export const BookingsListFiltersSchema = z.object({
  status: BookingStatusSchema.optional().describe('Filter by status'),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe(
      'Start of date range inclusive. YYYY-MM-DD only. If the user means "today", call server_clock first and use dateIso here. Omit if not filtering.',
    ),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe(
      'End of date range inclusive. For "today", use server_clock.dateIso for both from and to. Omit if not filtering.',
    ),
});

export type BookingsListFilters = z.infer<typeof BookingsListFiltersSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// AI tool args: update booking status (bookings_update_status)
// ─────────────────────────────────────────────────────────────────────────────

export const BookingsUpdateStatusArgsSchema = z
  .object({
    id: z
      .number()
      .optional()
      .describe('Booking ID (preferred — use id from bookings_list)'),
    reference: z
      .string()
      .optional()
      .describe('Booking reference code (e.g. BK-A3X9) if ID not known'),
    status: BookingStatusSchema.describe('New status for the booking'),
  })
  .refine((data) => data.id !== undefined || data.reference !== undefined, {
    message: 'Either id or reference is required',
  });

export type BookingsUpdateStatusArgs = z.infer<
  typeof BookingsUpdateStatusArgsSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Chat action: confirm booking status change
// ─────────────────────────────────────────────────────────────────────────────

export const BookingStatusUpdateActionSchema = z.object({
  type: z.literal('booking:status_update'),
  proposalId: z.string().uuid(),
  executionMode: z.enum(['confirm', 'auto']).default('confirm'),
  resolvedId: z.number(),
  reference: z.string().optional(),
  customerName: z.string(),
  serviceName: z.string().optional(),
  scheduledSummary: z.string(),
  currentStatus: BookingStatusSchema,
  newStatus: BookingStatusSchema,
});

export type BookingStatusUpdateAction = z.infer<
  typeof BookingStatusUpdateActionSchema
>;
