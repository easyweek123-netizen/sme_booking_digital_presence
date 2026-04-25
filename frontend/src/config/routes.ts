export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  PRICING: '/pricing',
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
  },
  BOOKING: {
    PATTERN: '/book/:slug',
    path: (slug: string) => `/book/${slug}`,
  },
} as const;

// Helper for type-safe navigation
export type RouteKey = keyof typeof ROUTES;

