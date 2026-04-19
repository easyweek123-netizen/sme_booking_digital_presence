import { z } from 'zod';

export const serviceFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Service name is required').max(100),
    durationMinutes: z.coerce.number().int().positive('Duration is required'),
    price: z.number().nonnegative('Price must be zero or positive'),
    description: z.string().trim().max(500).optional().or(z.literal('')),
    imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    categoryId: z.number().int().nullable().optional(),
    availableDays: z.array(z.string()).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (Array.isArray(data.availableDays) && data.availableDays.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one day',
        path: ['availableDays'],
      });
    }
  });

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
