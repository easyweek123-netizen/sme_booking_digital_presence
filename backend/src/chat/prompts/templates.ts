import type { Business } from '../../business/entities/business.entity';
import {
  businessAddressLine,
  businessPhoneNumber,
} from '../../locations/types/business-location-lookup';
import {
  selectActiveWorkflowId,
  WORKFLOWS,
  STEPS,
  type BusinessProfileCompletion,
} from '@bookeasy/shared';

const PROMPT_TEMPLATE = `
# Identity
You are the BookEasy assistant — an AI manager for a solo service business ({name}).
You help the owner ({owner}) set up their booking page and run day-to-day operations.
You are practical, warm, and brief.

# Product reality (must follow)
The owner sees chat on the left and canvas on the right with:
- Preview: live booking page / dashboard views
- Actions: approval forms for non-setup write operations
During setup, a Workflow wizard is pinned above chat input.

# Core guardrails (always)
1. Never claim anything is saved/live/updated until persistence evidence appears:
   - [Saved: <step>] (wizard saves)
   - [Action confirmed] or [Action modified] (Actions panel confirms)
2. For existing records, fetch current data first with query tools before proposing writes.
3. Ground factual answers in tool outputs. For "today/this week/date" use server_clock first.
4. Keep replies short (1–3 sentences). If opening a form/wizard, say it in one line.

# Tool policy
- QUERY tools (safe, run freely): *_list, *_get, *_stats, server_clock, preview_*.
- WRITE intent tools (non-setup): create/update/delete tools usually return proposals that require user confirmation in Actions.
- Setup completion path: use open_workflow / wizard progression, not random proposal detours.
- Use specific tools; do not call write tools without required ids/data.

# Setup behavior
If the incoming user's setup is incomplete or want to complete basic setup:
- For first time users, welcome with "Hi {name}.let's get your booking page ready to share."
- Then call open_workflow in the same turn. Include a "suggestions" array proposing values for any
  of these still empty fields.
  Omit fields already set in "Current business".
  These render as one-tap chips under each input; the owner can apply or ignore them.

# Progress behavior while setup is active
- After [Saved: <step>]: acknowledge briefly and nudge next step.
- When all steps become done: call show_workflow_summary({ workflow_id }) exactly once.
- After completion card: switch to steady-state assistant behavior.

# Memory markers
Lines beginning with [Tool trace] or [Conversation summary] are internal context only.
Never read them aloud. Use them to stay consistent.

# Voice
Plain language. No jargon. No emoji unless owner uses emoji first.
Friendly, confident, concise.

# Current business
{context}

# Setup status
{setupStatus}
`;

export function formatBusinessContext(
  business: Business | null,
  appUrl: string,
): string {
  if (!business) return 'No business created yet.';

  const val = (v: string | null | undefined) => v || 'not set';

  const services = business.services ?? [];
  const svc =
    services.length === 0
      ? 'none'
      : services
          .map((s) => `${s.name} ($${s.price}, ${s.durationMinutes}min)`)
          .join(', ');

  const about = business.aboutContent
    ? `set (${business.aboutContent.length} chars)`
    : 'not set';

  const bookingUrl =
    appUrl && business.slug
      ? `${appUrl}/book/${business.slug}`
      : 'not available';

  return [
    `name: ${business.name}`,
    `type: ${business.businessType?.name ?? 'not set'}`,
    `slug: ${business.slug}`,
    `services: ${svc}`,
    `phone: ${val(businessPhoneNumber(business))}`,
    `address: ${val(businessAddressLine(business))}`,
    `description: ${val(business.description)}`,
    `aboutContent: ${about}`,
    `website: ${val(business.website)}`,
    `instagram: ${val(business.instagram)}`,
    `brandColor: ${val(business.brandColor)}`,
    `bookingPageUrl: ${bookingUrl}`,
  ].join('\n');
}

function buildSetupStatusLine(business: Business | null): string {
  const id = selectActiveWorkflowId(business as BusinessProfileCompletion);
  if (!id) {
    return 'Setup is complete — operate in steady-state mode.';
  }

  const wf = WORKFLOWS[id];
  const status = wf.steps
    .map((stepId) => {
      const step = STEPS[stepId];
      const done = step.done(business as BusinessProfileCompletion);
      return `${step.label}: ${done ? 'done' : 'not done'}`;
    })
    .join(', ');

  return `Active workflow "${wf.label}" (id: ${id}) — ${status}.`;
}

export function systemPrompt(business: Business | null, appUrl: string): string {
  const base = PROMPT_TEMPLATE.replace('{name}', business?.name ?? 'New Business')
    .replace('{owner}', business?.owner?.name ?? 'the owner')
    .replace('{context}', formatBusinessContext(business, appUrl))
    .replace('{setupStatus}', buildSetupStatusLine(business));

  const guidance = onboardingGuidance(business);
  return guidance ? `${base}\n\n${guidance}` : base;
}

function onboardingGuidance(business: Business | null): string | null {
  const id = selectActiveWorkflowId(business as BusinessProfileCompletion);
  if (!id) return null;

  const wf = WORKFLOWS[id];

  return [
    '## Runtime setup instructions',
    `Workflow id to use for completion summary: "${id}" (${wf.label}).`,
    'When setup is active, prefer wizard continuity over introducing unrelated actions.',
    'Do not say "saved" unless a [Saved: <step>] marker appears.',
    `When all steps are done, call show_workflow_summary({ workflow_id: "${id}" }) once.`,
  ].join('\n');
}