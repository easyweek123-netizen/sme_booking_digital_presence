// Booking slot interval in minutes
// Appointments can only start at times divisible by this interval
// e.g., 15 means slots at 9:00, 9:15, 9:30, 9:45...
// Configurable via SLOT_INTERVAL_MINUTES env variable
export const SLOT_INTERVAL_MINUTES = parseInt(
  process.env.SLOT_INTERVAL_MINUTES || '30',
  10,
);

// Days of week constants
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

