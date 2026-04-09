import type { Suggestion } from '@bookeasy/shared';

export interface BusinessIdentity {
  businessName: string;
  businessType: string | null;
  description: string | null;
}

export const systemPrompt = (identity: BusinessIdentity): string => {
  const type = identity.businessType || 'business';
  const desc = identity.description
    ? ` | ${identity.description}`
    : '';

  return `You are BookEasy AI -- the dedicated business manager for "${identity.businessName}".
Business: ${identity.businessName} | Type: ${type}${desc}

You help the owner manage their entire business through conversation:
services, bookings, clients, and their public booking page.

RULES:
1. Use tools for all data operations -- never guess or fabricate data. If a value was not returned by a tool, do not use it. Say "I don't have that information" instead of inventing numbers, IDs, or dates.
2. When answering questions that span multiple entities (e.g. customer spending, revenue), call all relevant tools and cross-reference results. For example, to calculate spending: get bookings (bookings_list) + service prices (services_list) and match by service name.
3. For changes (create, update, delete), always propose first and let the user confirm.
4. Use IDs from tool results for follow-up operations -- never invent an ID. Never expose IDs to users -- speak naturally using names.
5. Be concise -- 2-3 sentences unless the user asks for detail.
6. You can chat about anything -- business advice, ideas, general questions.
7. Proactively suggest helpful actions based on the current business state.
8. Assistant messages must be plain language only for the user to read. Never output tool-call markup such as <function=...>...</function>, XML-style tags, or invented function names (e.g. *_execute). Real tools are invoked by the system, not written inside your reply text—including after the user confirms an action.`;
};

export const buildWelcome = (businessName: string): string =>
  `Welcome to ${businessName}! I'm your AI business manager. I can help you manage services, bookings, clients, and more. What would you like to do?`;

interface SuggestionRule {
  priority: number;
  condition: (ctx: BusinessIdentity) => boolean;
  build: (ctx: BusinessIdentity) => Suggestion;
}

const SUGGESTION_RULES: SuggestionRule[] = [
  {
    priority: 0,
    condition: (ctx) => !ctx.businessType,
    build: () => ({ label: 'Set business type', value: 'Help me set my business type' }),
  },
  {
    priority: 1,
    condition: (ctx) => !ctx.description,
    build: () => ({ label: 'Add a description', value: 'Help me add a business description' }),
  },
  {
    priority: 10,
    condition: () => true,
    build: () => ({ label: 'Manage services', value: 'Show me my services' }),
  },
  {
    priority: 11,
    condition: () => true,
    build: () => ({ label: "Today's bookings", value: "What's my schedule today?" }),
  },
  {
    priority: 12,
    condition: () => true,
    build: () => ({ label: 'View clients', value: 'Show my clients' }),
  },
];

export const buildSuggestions = (identity: BusinessIdentity): Suggestion[] =>
  SUGGESTION_RULES
    .filter((rule) => rule.condition(identity))
    .sort((a, b) => a.priority - b.priority)
    .map((rule) => rule.build(identity));
