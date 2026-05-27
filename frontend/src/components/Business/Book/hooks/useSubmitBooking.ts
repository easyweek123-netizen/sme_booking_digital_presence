import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useCreateBookingMutation } from '../../../../store/api/bookingsApi';
import { TOAST_DURATION } from '../../../../constants';
import type { Service } from '../../../../types';
import type { BookingAuth } from './useBookingAuth';

interface SubmitArgs {
  service: Service;
  date: Date;
  slot: string;
}

/**
 * Returns an `onSubmit` handler matching the `BookingWizard` contract.
 * Translates the wizard payload to the BE Zod schema, toasts on
 * failure, and re-throws so `useBookingFlow` rolls back to the
 * checkout step instead of advancing to success.
 */
export function useSubmitBooking(auth: BookingAuth) {
  const toast = useToast();
  const [createBooking] = useCreateBookingMutation();

  return useCallback(
    async ({ service, date, slot }: SubmitArgs) => {
      if (!auth.customerEmail) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in with Google to confirm your booking.',
          status: 'warning',
          duration: TOAST_DURATION.MEDIUM,
          isClosable: true,
        });
        throw new Error('Not authenticated');
      }

      try {
        await createBooking({
          serviceId: service.id,
          date: toIsoDate(date),
          startTime: slot,
          customerName: auth.customerName,
          customerEmail: auth.customerEmail,
        }).unwrap();
      } catch (error) {
        const message =
          (error as { data?: { message?: string } })?.data?.message ??
          'We could not confirm your booking. Please try again.';
        toast({
          title: 'Booking failed',
          description: message,
          status: 'error',
          duration: TOAST_DURATION.LONG,
          isClosable: true,
        });
        throw error;
      }
    },
    [auth, createBooking, toast],
  );
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
