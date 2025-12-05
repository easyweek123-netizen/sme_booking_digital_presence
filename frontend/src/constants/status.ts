import type { BookingStatus } from '../types';

/**
 * Booking status configuration with semantic colors
 * Colors are carefully chosen for accessibility and meaning:
 * - Amber/Yellow: Pending, awaiting action
 * - Emerald/Green: Confirmed, positive state
 * - Blue: Completed, informational
 * - Red: Cancelled, negative state
 * - Gray: No-show, neutral/inactive
 */
export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { color: string; bg: string; label: string }
> = {
  PENDING: {
    color: '#D97706',    // Amber-600
    bg: '#FEF3C7',       // Amber-100
    label: 'Request',
  },
  CONFIRMED: {
    color: '#059669',    // Emerald-600
    bg: '#D1FAE5',       // Emerald-100
    label: 'Confirmed',
  },
  COMPLETED: {
    color: '#2563EB',    // Blue-600
    bg: '#DBEAFE',       // Blue-100
    label: 'Completed',
  },
  CANCELLED: {
    color: '#DC2626',    // Red-600
    bg: '#FEE2E2',       // Red-100
    label: 'Cancelled',
  },
  NO_SHOW: {
    color: '#4B5563',    // Gray-600
    bg: '#F3F4F6',       // Gray-100
    label: 'No-show',
  },
} as const;

/**
 * Get status configuration by status key
 */
export function getStatusConfig(status: BookingStatus) {
  return BOOKING_STATUS_CONFIG[status];
}

