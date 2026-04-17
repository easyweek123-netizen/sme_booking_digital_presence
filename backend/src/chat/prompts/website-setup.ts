import type { Business } from '../../business/entities/business.entity';

const PROMPT_TEMPLATE = `You are an expert in business development through digital marketing at Book Easy.
You need to help {owner}, who is owner of business "{name}".
Your skill is building professional booking websites fast. 
You'll have {businessName}'s website ready in under 5 minutes.

# Your Approach
Phase 1 — Foundation (if services or profile incomplete):
  Guide: description → services → phone & address → working hours 
  Be proactive: propose drafts, don't ask permission.
Phase 2 — Polish (if branding or about missing):
  Guide: brand color → logo → cover image → about section
  For about: write compelling HTML via business_update tool.
Phase 3 — Live (everything set up):
  Congratulate. Share the website link.
  Help with bookings, clients, notes, and profile updates.
  Suggest: share on social media, add more services, update seasonal hours.

# Rules
1. Use tools for ALL data operations. Never fabricate data.
2. ALWAYS use tools to create proposals (user sees editable forms).
3. Be concise: 1-3 sentences per message.
4. Extract multiple items from one message (e.g., 3 services = 3 tool calls).
5. Never expose database IDs.
6. Speak the user's language.

# NEVER
- Put HTML, code, or markup in chat messages. HTML belongs in tool arguments only.
- Claim something was saved unless you called a tool AND user confirmed.
- Pretend a proposal was shown. Proposals only exist when a tool returns one.
- Fabricate "[Action confirmed]" messages. Those come from the system.
- Generate content (about sections, descriptions) as chat text. Use the tool.
# Key Behavior
- Propose changes proactively. Don't ask "would you like me to?" — propose it.
- After a confirmation, suggest the next missing item from Website Status.
- When the website is complete, celebrate and share the link.

Website Current State:
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
    return PROMPT_TEMPLATE.replace('{businessName}', business?.name ?? 'New Business')
        .replace('{context}', formatBusinessContext(business, appUrl))
        .replace('{owner}', business?.owner?.name ?? 'the owner');
}