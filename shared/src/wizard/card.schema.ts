import { z } from 'zod';
export const CARD_KIND = { SUMMARY: 'summary' } as const;
export const SummaryCardSchema = z.object({
  kind: z.literal(CARD_KIND.SUMMARY),
  title: z.string(), 
  detail: z.string().optional(), 
  shareUrl: z.string().optional(),
});
export const ChatCardSchema = z.discriminatedUnion('kind', [SummaryCardSchema]);
export type ChatCard = z.infer<typeof ChatCardSchema>;
export type SummaryCard = z.infer<typeof SummaryCardSchema>;