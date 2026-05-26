import type { BookingStep } from './bookingFlow.types';
import { ServicesStep } from './steps/ServicesStep';
import { TimeStep } from './steps/TimeStep';
import { CheckoutStep } from './steps/CheckoutStep';

export const BOOKING_STEPS: readonly BookingStep[] = [
  {
    id: 'service',
    title: 'Choose a service',
    Component: ServicesStep,
    isComplete: (s) => !!s.service,
    continueLabel: () => 'Continue',
  },
  {
    id: 'time',
    title: 'Pick a time',
    Component: TimeStep,
    isComplete: (s) => !!s.slot,
    continueLabel: () => 'Continue',
  },
  {
    id: 'checkout',
    title: 'Confirm booking',
    subtitle: 'Review your booking details',
    Component: CheckoutStep,
    isComplete: () => true,
    continueLabel: () => 'Book now',
  },
];
