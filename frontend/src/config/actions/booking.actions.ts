import { useUpdateBookingStatusMutation } from '../../store/api/bookingsApi';
import { DashboardBookingStatusAction } from '../../components/canvas/DashboardBookingStatusAction';
import { defineHandler, type RuntimeActionHandler } from './types';
import type { BookingStatusUpdateAction } from '@shared';

/**
 * Booking-related canvas actions (AI proposals).
 * Same dashboard card + confirm dialog as /dashboard/bookings; PATCH only in execute below.
 */
export function useBookingActions(): Record<string, RuntimeActionHandler> {
  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  return {
    'booking:status_update': defineHandler<
      BookingStatusUpdateAction,
      { confirmed: boolean }
    >({
      component: DashboardBookingStatusAction,
      title: 'Update booking',
      getProps: (action) => ({ action }),
      execute: async (action) => {
        await updateBookingStatus({
          id: action.resolvedId,
          status: action.newStatus,
        }).unwrap();
      },
    }),
  };
}
