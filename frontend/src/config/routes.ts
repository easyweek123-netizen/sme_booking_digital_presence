export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  PRICING: '/pricing',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  DASHBOARD: {
    ROOT: '/dashboard',
    CHAT: '/dashboard/chat',
    BOOKINGS: '/dashboard/bookings',
    SERVICES: '/dashboard/services',
    SETTINGS: '/dashboard/settings',
  },
  BOOKING: {
    PATTERN: '/book/:slug',
    path: (slug: string) => `/book/${slug}`,
  },
} as const;

// Helper for type-safe navigation
export type RouteKey = keyof typeof ROUTES;

