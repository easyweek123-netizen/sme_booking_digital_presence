import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Customer List Args (AI tool input)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Arguments for the customers_list tool.
 * Optional search filters by name or email.
 */
export const CustomersListArgsSchema = z.object({
  search: z
    .string()
    .optional()
    .describe('Search customers by name or email (partial match)'),
});

export type CustomersListArgs = z.infer<typeof CustomersListArgsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Customer Get Args (AI tool input)
// ─────────────────────────────────────────────────────────────────────────────

export const CustomersGetArgsSchema = z
  .object({
    id: z
      .number()
      .optional()
      .describe('Customer ID (preferred — use id from customers_list)'),
    name: z
      .string()
      .optional()
      .describe('Customer name (fallback if ID not available)'),
  })
  .refine((data) => data.id !== undefined || data.name !== undefined, {
    message: 'Either id or name is required',
  });

export type CustomersGetArgs = z.infer<typeof CustomersGetArgsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Customer List Item Schema (returned data shape)
// ─────────────────────────────────────────────────────────────────────────────

export const CustomerListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  bookingCount: z.number(),
  lastBookingDate: z.string().nullable(),
});

export type CustomerListItem = z.infer<typeof CustomerListItemSchema>;
