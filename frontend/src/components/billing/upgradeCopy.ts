export type UpgradeCopy = {
  /** Small uppercase label above the title. */
  eyebrow: string;
  /** Bold value-oriented headline. */
  title: string;
  /** Plain-language explanation with concrete numbers. */
  body: string;
};

/**
 * Per-feature copy for the upgrade modal. Keys must match backend EntitlementKey.
 * Add a new entry whenever a new entitlement is added in
 * `backend/src/entitlements/config/entitlements.config.ts`.
 */
export const UPGRADE_COPY: Record<string, UpgradeCopy> = {
  'service.create': {
    eyebrow: 'Service limit reached',
    title: 'Add unlimited services',
    body: 'Your Free plan includes 3 active services. Upgrade to Pro to add as many as your business needs.',
  },
  'bookings.confirm': {
    eyebrow: 'Monthly booking limit',
    title: 'Confirm every booking',
    body: 'Free plan caps confirmations at 30 per month. Upgrade to Pro to keep accepting bookings without interruption.',
  },
  'chat.history': {
    eyebrow: 'Pro feature',
    title: 'Keep your chat history',
    body: 'Browse, search, and continue past conversations with your AI assistant.',
  },
  'analytics.view': {
    eyebrow: 'Pro feature',
    title: 'Unlock business analytics',
    body: 'Revenue, repeat customers, busiest hours — everything you need to grow.',
  },
  'reminders.send': {
    eyebrow: 'Pro feature',
    title: 'Cut no-shows with reminders',
    body: 'Automatic email and SMS reminders sent to your customers before each booking.',
  },
  'calendar.sync': {
    eyebrow: 'Pro feature',
    title: 'Sync to Google Calendar',
    body: 'Every confirmed booking lands on your Google Calendar automatically — cancellations and reschedules update in real time.',
  },
  'domain.customize': {
    eyebrow: 'Pro feature',
    title: 'Use your own domain',
    body: 'Run your booking page on your own domain — book.yourbusiness.com.',
  },
};

/** Fallback when `feature` is missing from the 402 body or unmapped. */
export const DEFAULT_UPGRADE_COPY: UpgradeCopy = {
  eyebrow: 'Pro feature',
  title: 'Unlock Pro',
  body: 'Upgrade to keep growing without limits.',
};

export function copyForFeature(feature?: string): UpgradeCopy {
  if (!feature) return DEFAULT_UPGRADE_COPY;
  return UPGRADE_COPY[feature] ?? DEFAULT_UPGRADE_COPY;
}
