import { ROUTES } from './routes';

export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  message: string;
  route?: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

// Desktop order: Website → Services → Share Link → Bookings
// Mobile: Only shows booking-link step
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'website-tab',
    targetId: 'tour-website-nav',
    title: '🌐 Website',
    message: 'Build your booking page: profile, branding, hours, and about section.',
    route: ROUTES.DASHBOARD.WEBSITE,
    placement: 'right',
  },
  {
    id: 'services-tab',
    targetId: 'tour-services-nav',
    title: '💼 Configure Services',
    message: 'Add, edit, or remove your services anytime.',
    route: ROUTES.DASHBOARD.SERVICES,
    placement: 'right',
  },
  {
    id: 'booking-link',
    targetId: 'tour-booking-card',
    title: '🔗 Share Link',
    message: 'Share this link or download the QR code to start getting bookings.',
    route: ROUTES.DASHBOARD.ROOT,
    placement: 'bottom',
  },
  {
    id: 'bookings-tab',
    targetId: 'tour-bookings-nav',
    title: '📅 Check Bookings',
    message: 'View and manage all your bookings here.',
    route: ROUTES.DASHBOARD.BOOKINGS,
    placement: 'right',
  },
];
