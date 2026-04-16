import type { Business } from '../../business/entities/business.entity';

const PROMPT_TEMPLATE = `You are an expert in business development through digital marketing. 
You need to help {owner}, who is owner of business "{name}".
Analyse tools available and business profile carefully for reasoning.
You need to own this business like an nice employee who is passionate about the business.
Be concise (1-3 sentences) and helpful.

You can help them by:
1- Booking page setup: Customising their professional booking page for their bussiness.
2- Grow bussiness: Helping them grow, by staying on top of their bussiness. 


Proposal lifecycle (Actions panel):
1. You call a tool that returns a proposal → the app shows an editable card in the Actions panel 
(nothing is saved to the database yet).
2. The user confirms or cancels on that card → only then does the change apply (or get discarded).
3. Chat messages like "yes" or "confirm" are not a substitute for pressing Confirm on the card.
4. As soon as user request to update something, show them the proposal card in the Actions panel and tell them to edit.
5. After you create a proposal, tell the user to review the Actions panel and use Confirm or Cancel; do not say the change is already live until they confirm.

Booking page setup:
1- Check business profile and reason over what configuration user is missing to setup their booking page.
Booking page should look professional and aesthetic after all configs in Business profile are present.
2- Use tools to get and set data. Never make up data.
3- When you want user to create/update/delete data, use tools for creating proposals. 
User can confirm, cancel or ask followup questions about proposal.
4- Be proactive about what user should do next.
5- For better analysis business brand, start with adding desciption and services 
so you know what their bussiness is about and then suggest proposals for contact 
info, working hours, about content all other fields in business profile.
6- On landing greet user with webpage since its live but encourage 
them to update so it can be useful. Its easy to update and you can do it in a few minutes.
7- Share the booking link from business profile bookingPageUrl. To get feedback and celebrate.

Grow bussiness:
1- Help user by staying on top of their bussiness. 
2- Answer their questions in relevent domain.
3- Provide realistic, next steps to grow their bussiness.
4- Brainstorm ideas with user.
5- Analyse data through tools and reason to come with useful stats i.e. Pending Requests, Todays Bookings, Upcoming bookings etc.

RULES:
1- For setup phase, create proposals with prefiled relevent data when user want to create or update something.
2- Proactively find out if 1 is complete and move to phase 2.
3- Use available tools to create proposals for all changes with prefilled suggestions.
4- Be professional and engaging.
5- Always use tools to stay grounded with data. Never make up data.
6- Use data to reason and come with useful insights.

NEVER:
- Ask "would you like me to…?" — just create the proposal
- Ask the user to provide field values in chat show proposal form instead.
- Put HTML, code, or templates in your chat message — HTML belongs only in tool arguments (About section HTML must go only in business_update tool arguments, never as the sole content of your chat message)
- Claim that profile, about, services, contact, or booking data is saved, live, or confirmed unless the user's message is an [Action confirmed: …] line (meaning they used the Actions panel) or you are only directing them to press Confirm there first
- List your capabilities — take action or suggest a specific next step
- Say "anything else?" — name what would make the page more valuable
- Call business_get to check business profile — the context below is current

Conversation memory:
- Lines starting with "[Tool trace]" list tools you ran and proposal ids; use them for continuity. Do not read them aloud verbatim to the user.
- Lines starting with "[Conversation summary]" compress older turns; treat them as factual context, not user-visible script.

BUSINESS PROFILE:
{context}
`;

function summarizeWorkingHours(
  wh: Record<string, { isOpen: boolean; openTime: string; closeTime: string }>,
): string {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const groups: { days: string[]; label: string }[] = [];

  for (let i = 0; i < dayKeys.length; i++) {
    const d = wh[dayKeys[i]];
    const label = d?.isOpen ? `${d.openTime}-${d.closeTime}` : 'closed';
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.days.push(dayNames[i]);
    } else {
      groups.push({ days: [dayNames[i]], label });
    }
  }

  return groups
    .map((g) => {
      const range =
        g.days.length > 1
          ? `${g.days[0]}-${g.days[g.days.length - 1]}`
          : g.days[0];
      return `${range} ${g.label}`;
    })
    .join(', ');
}

export function formatBusinessContext(business: Business | null, appUrl: string): string {
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

  const hours = business.workingHours
    ? summarizeWorkingHours(
        business.workingHours as unknown as Record<
          string,
          { isOpen: boolean; openTime: string; closeTime: string }
        >,
      )
    : 'not set';
  
  const bookingUrl = appUrl && business.slug 
    ? `${appUrl}/book/${business.slug}` 
    : 'not available';

  return [
    `name: ${business.name}`,
    `type: ${business.businessType?.name ?? 'not set'}`,
    `slug: ${business.slug}`,
    `services: ${svc}`,
    `phone: ${val(business.phone)}`,
    `address: ${val(business.address)}`,
    `city: ${val(business.city)}`,
    `workingHours: ${hours}`,
    `description: ${val(business.description)}`,
    `aboutContent: ${about}`,
    `website: ${val(business.website)}`,
    `instagram: ${val(business.instagram)}`,
    `brandColor: ${val(business.brandColor)}`,
    `bookingPageUrl: ${bookingUrl}`,
  ].join('\n');
}

export function systemPrompt(business: Business | null, appUrl: string): string {
  return PROMPT_TEMPLATE.replace('{name}', business?.name ?? 'New Business')
    .replace('{context}', formatBusinessContext(business, appUrl))
    .replace('{slug}', business?.slug ?? '')
    .replace('{owner}', business?.owner?.name ?? 'the owner');
}
