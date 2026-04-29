export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  PRICING: '/pricing',
  SERVICES: '/services',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  IMPRESSUM: '/impressum',
  DASHBOARD: {
    ROOT: '/dashboard',
    CANVAS: '/dashboard/canvas',
    BOOKINGS: '/dashboard/bookings',
    CLIENTS: '/dashboard/clients',
    SERVICES: '/dashboard/services',
    WEBSITE: '/dashboard/website',
    SETTINGS: '/dashboard/settings',
    SETTINGS_BILLING: '/dashboard/settings/billing',
    SETTINGS_CHECKOUT: '/dashboard/settings/checkout',
  },
  BOOKING: {
    PATTERN: '/book/:slug',
    path: (slug: string) => `/book/${slug}`,
  },
} as const;

// Helper for type-safe navigation
export type RouteKey = keyof typeof ROUTES;

