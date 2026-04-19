import { z } from 'zod';

export const feedbackFormSchema = z.object({
  topic: z.enum(['Product Feedback', 'IT Services Inquiry']),
  email: z.string().trim().email('Please enter a valid email'),
  message: z.string().trim().min(10, 'Please share at least 10 characters'),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;
