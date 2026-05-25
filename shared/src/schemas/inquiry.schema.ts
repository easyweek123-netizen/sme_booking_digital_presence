import { z } from 'zod';

export const InquiryCreateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  company: z.string().max(255).nullable().optional(),
  budget: z.enum(['under_5k', '5_15k', '15_50k', '50k_plus', 'not_sure']),
  message: z.string().min(1).max(5000),
  source: z.string().max(50).optional(),
  serviceId: z.number().int().positive().nullable().optional(),
});
export type InquiryCreateInput = z.infer<typeof InquiryCreateSchema>;
