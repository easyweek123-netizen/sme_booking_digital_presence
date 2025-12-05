export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  DASHBOARD: {
    ROOT: '/dashboard',
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

