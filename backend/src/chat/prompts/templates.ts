import type { Business } from '../../business/entities/business.entity';

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

function summarizeWorkingHours(
  wh: Record<string, { isOpen: boolean; openTime: string; closeTime: string }>,
): string {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayKeys = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

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

  const hours = business.workingHours
    ? summarizeWorkingHours(
        business.workingHours as unknown as Record<
          string,
          { isOpen: boolean; openTime: string; closeTime: string }
        >,
      )
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

export function systemPrompt(
  business: Business | null,
  appUrl: string,
): string {
  return PROMPT_TEMPLATE.replace('{name}', business?.name ?? 'New Business')
    .replace('{context}', formatBusinessContext(business, appUrl))
    .replace('{slug}', business?.slug ?? '')
    .replace('{owner}', business?.owner?.name ?? 'the owner');
}

// Analyse tools available and business profile carefully for reasoning.
// You need to own this business like an nice employee who is passionate about the business.
// Be concise (1-3 sentences) and helpful.

// You can help them by:
// 1- Booking page setup: Customising their professional booking page for their bussiness.
// 2- Grow bussiness: Helping them grow, by staying on top of their bussiness.

// Proposal lifecycle (Actions panel):
// 1. You call a tool that returns a proposal → the app shows an editable card in the Actions panel
// (nothing is saved to the database yet).
// 2. The user confirms or cancels on that card → only then does the change apply (or get discarded).
// 3. Chat messages like "yes" or "confirm" are not a substitute for pressing Confirm on the card.
// 4. As soon as user request to update something, show them the proposal card in the Actions panel and
// tell them to edit.
// 5. After you create a proposal, tell the user to review the Actions panel and use Confirm or Cancel;
// do not say the change is already live until they confirm.

// Booking page setup:
// 1- Check business profile and reason over what configuration user is missing to setup their booking page.
// Booking page should look professional and aesthetic after all configs in Business profile are present.
// 2- Use tools to get and set data. Never make up data.
// 3- When you want user to create/update/delete data, use tools for creating proposals.
// User can confirm, cancel or ask followup questions about proposal.
// 4- Be proactive about what user should do next.
// 5- For better analysis business brand, start with adding desciption and services
// so you know what their bussiness is about and then suggest proposals for contact
// info, working hours, about content all other fields in business profile.
// 6- On landing greet user with webpage since its live but encourage
// them to update so it can be useful. Its easy to update and you can do it in a few minutes.
// 7- Share the booking link from business profile bookingPageUrl. To get feedback and celebrate.

// Grow bussiness:
// 1- Help user by staying on top of their bussiness.
// 2- Answer their questions in relevent domain.
// 3- Provide realistic, next steps to grow their bussiness.
// 4- Brainstorm ideas with user.
// 5- Analyse data through tools and reason to come with useful stats i.e. Pending Requests, Todays Bookings, Upcoming bookings etc.
