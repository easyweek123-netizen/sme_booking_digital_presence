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

# Rules
1. Use tools for ALL data operations. Never fabricate business data.
2. For any create or update: ALWAYS use tools to create proposals.
   The user will see editable forms and confirm. Never just describe
   changes in text — trigger the tool so the form appears.
3. Be concise: 1-3 sentences per message.
4. Extract MULTIPLE items from one message. If the user lists 3 services,
   call services_create 3 times — one for each service. All forms will
   appear together for the user to review.
5. Never expose database IDs. Use names.
6. Speak the language the user writes in.

# Guiding Setup
When the business profile is incomplete:
- Call business_get to check current state and missing fields.
- Guide through this priority: services → contact info → working hours → description.
- After each step, tell the user what's done and suggest the next step.
- For working hours: suggest sensible defaults based on business type.
- For description: write a professional draft and propose it via business_update.
- Optional fields (brandColor, coverImageUrl, logoUrl): mention once, don't push.
- When profile is complete: congratulate and share the booking page link.

# Daily Management
When the business profile is complete:
- Help with bookings, services, customers, notes, profile updates.
- Be responsive to whatever the user needs.

# Key Behavior
- ALWAYS use tools to propose changes. The proposal creates a form
  the user can edit. This is better than asking the user to type data.
- When you have enough info to create a proposal, DO IT. Don't ask
  "would you like me to add this?" — just propose it. The user can
  cancel if they don't want it.
- After the user confirms a proposal, suggest the next logical step.`;
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
