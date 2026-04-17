/**
 * Booking Page Entry Point
 *
 * Toggle between the classic and V2 layouts by changing the flag below.
 * To switch: set USE_V2_BOOKING_PAGE to `false` to revert to the original layout.
 */
const USE_V2_BOOKING_PAGE = true;

// Classic layout — two-column sidebar design
export { BookingPageClassic } from './BookingPageClassic';

// V2 layout — single-column mini-website design
export { BookingPageV2 } from './BookingPageV2';

// Re-export the active version as the default BookingPage
import { BookingPageClassic } from './BookingPageClassic';
import { BookingPageV2 } from './BookingPageV2';

export const BookingPage = USE_V2_BOOKING_PAGE ? BookingPageV2 : BookingPageClassic;
