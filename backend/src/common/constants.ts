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

// Default working hours: Mon-Fri 9:00-17:00, Sat-Sun closed
import type { WorkingHours, DaySchedule } from './types';

const defaultDaySchedule: DaySchedule = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '17:00',
};

const closedDaySchedule: DaySchedule = {
  isOpen: false,
  openTime: '09:00',
  closeTime: '17:00',
};

export const DEFAULT_WORKING_HOURS: WorkingHours = {
  monday: { ...defaultDaySchedule },
  tuesday: { ...defaultDaySchedule },
  wednesday: { ...defaultDaySchedule },
  thursday: { ...defaultDaySchedule },
  friday: { ...defaultDaySchedule },
  saturday: { ...closedDaySchedule },
  sunday: { ...closedDaySchedule },
};

