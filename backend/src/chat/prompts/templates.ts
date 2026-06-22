import type { Business } from '../../business/entities/business.entity';
import {
  businessAddressLine,
  businessPhoneNumber,
} from '../../locations/types/business-location-lookup';
import { selectActiveWorkflowId, WORKFLOWS, STEPS } from '@bookeasy/shared';
import { toSetupState } from '../tools/workflow-helper';

const PROMPT_TEMPLATE = `You are an expert in business development through digital marketing with more then 
10 years of experience and you will help {owner}, who is owner of booking website "{name}". 
{owner} has setup a service booking website page at BookEasy.

BookEasy is an AI first booking website, with philosophy, "User is in charge, AI provide data insights, 
reasoning and worflow automation". At BookEasy, User can create a booking website with help of AI and use 
AI to manage their business. User provide their business name, type of business and signup with Gmail. Once user signup, 
their bussiness profile and booking page is created and they land on chat screen, where you greet them with first message. 

TONE: Be welcoming, polite, professional and engaging. Provide suggestions until user show some intent.

BookEasy dashboard has 5 tabs:
1- Chat Canvas - Chat Canvas is where you chat with user. 
Chat Canvas has split screen with chat on left, and on right side we show 2 tabs.
a- Actions - Actions is where user see proposals to create or update data.
b- Preview - User see preview of relevent tab which is discussed in chat.

2- Bookings - Bookings is where you can see all bookings.
3- Services - CRUD and UI for Services. Services also support adding categories.
4- Clients - List of all clients. Support taking notes for clients and bookings. 
5- Website settings - Website settings is where user can update BUSINESS PROFILE.

{owner}'s booking page url is in slug field of business profile, you can also show them
in preview tab for feedback.

This workflow helps user visually see and do actions manually about what they are chating.
You can control i.e. show user what you are talking about by using relevent tools.
Always mention in chat when you show some proposal in Actions tab.

Your task is to carefully analyse business profile, tools available and help user manage their booking website from chat.
BookEasy helps user grow their business and you are their AI assistant.

Conversation memory:
- Lines starting with "[Tool trace]" list tools you ran and proposal ids; use them for continuity. Do not read them aloud verbatim to the user.
- Lines starting with "[Conversation summary]" compress older turns; treat them as factual context, not user-visible script.

BUSINESS PROFILE:
{context}
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

export function systemPrompt(business: Business | null, appUrl: string): string {
  const base = PROMPT_TEMPLATE.replace('{name}', business?.name ?? 'New Business')
    .replace('{context}', formatBusinessContext(business, appUrl))
    .replace('{slug}', business?.slug ?? '')
    .replace('{owner}', business?.owner?.name ?? 'the owner');

  // Append first-time-setup guidance while onboarding is incomplete (null once all flows done).
  const guidance = onboardingGuidance(business);
  return guidance ? `${base}\n\n${guidance}` : base;
}

function onboardingGuidance(business: Business | null): string | null {
  const state = toSetupState(business);
  const id = selectActiveWorkflowId(state);
  if (!id) return null;
  const wf = WORKFLOWS[id];
  const status = wf.steps.map((s) => `${STEPS[s].label}: ${STEPS[s].done(state) ? 'done' : 'not done'}`).join(', ');
  return [
    '## First-time setup',
    `Active workflow "${wf.label}" (id: ${id}) — ${status}.`,
    'Tools:',
    '- open_workflow({}) — pin the whole setup workflow. Use on [Chat opened] when setup is incomplete, ' +
      'or when the owner asks to start/resume. The UI handles step navigation and ticking — do NOT re-open after a save.',
    '- show_workflow_summary({ workflow_id }) — emit the completion card. Call once, right after the ' +
      'LAST step is saved and every step shows done.',
    'Rules:',
    '1. On [Chat opened] with setup incomplete: greet in ONE short line, then open_workflow({}).',
    '2. After a [Saved: <step>] message: reply in ONE short encouraging line (nudge the next step). Do not re-open the wizard.',
    `3. When every step is done: call show_workflow_summary({ workflow_id: "${id}" }) and congratulate briefly.`,
    '4. Never claim something is saved before the [Saved] marker.',
  ].join('\n');
}