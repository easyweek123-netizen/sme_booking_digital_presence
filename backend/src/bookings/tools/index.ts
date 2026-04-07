import { ListBookingsTool } from './list.tool';
import { BookingStatsTool } from './stats.tool';
import { UpdateBookingStatusTool } from './update-status.tool';

export { ListBookingsTool } from './list.tool';
export { BookingStatsTool } from './stats.tool';
export { UpdateBookingStatusTool } from './update-status.tool';

export const BookingToolHandlers = [
  ListBookingsTool,
  BookingStatsTool,
  UpdateBookingStatusTool,
];
