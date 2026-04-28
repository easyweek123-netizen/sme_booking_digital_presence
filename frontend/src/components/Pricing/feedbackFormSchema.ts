import { z } from 'zod';

export const feedbackFormSchema = z.object({
  email: z.string().trim().email('Please enter a valid email'),
  message: z.string().trim().optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;
