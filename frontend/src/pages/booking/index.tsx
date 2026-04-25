/**
 * Booking Page Entry Point
 *
 * Toggle between the classic and V2 layouts by changing the flag below.
 */
import type { ComponentProps } from 'react';
import { BookingPageClassic } from './BookingPageClassic';
import { BookingPageV2 } from './BookingPageV2';

const USE_V2_BOOKING_PAGE = true;

export { BookingPageClassic, BookingPageV2 };

type BookingPageProps = ComponentProps<typeof BookingPageV2>;

export function BookingPage(props: BookingPageProps) {
  if (USE_V2_BOOKING_PAGE) return <BookingPageV2 {...props} />;
  return (
    <BookingPageClassic
      {...(props as unknown as ComponentProps<typeof BookingPageClassic>)}
    />
  );
}
