import { z } from 'zod';

// ──────────────────────────────────────────────────────────────────────────────
// Chat cards — inline rich blocks rendered in the message stream.
// A turn's cards are persisted on the assistant message row; old cards are
// immutable snapshots. This union is general; onboarding is just one consumer.
// ──────────────────────────────────────────────────────────────────────────────

// ── progress card — read-only setup status. Pure render (§3). ──────────────────
export const ProgressFlowSchema = z.object({
  id: z.string(),                 // correlates to a tile / wizard preset (e.g. "branding")
  label: z.string(),              // "Branding"
  hint: z.string().optional(),    // "Name, look, color, about"
  done: z.boolean(),
});
export const ProgressCardSchema = z.object({
  kind: z.literal('progress'),
  flows: z.array(ProgressFlowSchema),   // doneCount / total derived on FE from flows
});

// ── tiles card — clickable choices; tap sends a user message (§3). ─────────────
// Reused later for service / location templates; items are self-describing.
export const TileItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  subtitle: z.string().optional(),
  icon: z.string().optional(),    // icon key, resolved on FE (components/icons)
  message: z.string(),            // sent verbatim as a user message on tap → agent reacts
});
export const TilesCardSchema = z.object({
  kind: z.literal('tiles'),
  items: z.array(TileItemSchema),
});

// ── wizard card — multi-step form. Apply → confirmed, Skip → cancelled. ────────
export const WizardCardSchema = z.object({
  kind: z.literal('wizard'),
  proposalId: z.string().uuid(),                 // echoed back via sendActionResult
  submitAction: z.string(),                      // actions-registry key (e.g. 'business:update')
  preset: z.string().optional(),                 // opaque FE preset id; absent → ad-hoc single-step
  suggestions: z.record(z.unknown()).optional(), // AI-suggested field values (chips)
  initialValues: z.record(z.unknown()).optional(),// prefill from current entity state
});

// ── summary card — ✓ receipt. shareUrl present → "ready to share" variant. ─────
export const SummaryCardSchema = z.object({
  kind: z.literal('summary'),
  title: z.string(),                             // "Branding saved"
  preset: z.string().optional(),                 // selects the summary body layout
  snapshot: z.record(z.unknown()).optional(),    // fields rendered in the body
  shareUrl: z.string().optional(),               // booking URL — final "all done" card only
});

// ── union ──────────────────────────────────────────────────────────────────────
export const ChatCardSchema = z.discriminatedUnion('kind', [
  ProgressCardSchema, TilesCardSchema, WizardCardSchema, SummaryCardSchema,
]);
export type ChatCard = z.infer<typeof ChatCardSchema>;
export type ProgressCard = z.infer<typeof ProgressCardSchema>;
export type TilesCard = z.infer<typeof TilesCardSchema>;
export type WizardCard = z.infer<typeof WizardCardSchema>;
export type SummaryCard = z.infer<typeof SummaryCardSchema>;

// Onboarding preset ids — a CONSUMER-level constant, intentionally NOT baked into
// the card schemas above. Shared by the backend open_wizard/show_progress tools and
// the FE preset registry to avoid magic strings.
export const ONBOARDING_PRESETS = ['branding', 'location', 'service'] as const;
export type OnboardingPreset = (typeof ONBOARDING_PRESETS)[number];