import type { AvailabilityInput } from '@bookeasy/shared';

export const DEFAULT_BUSINESS_HOURS: AvailabilityInput[] = [1, 2, 3, 4, 5].map(
  (dayOfWeek) => ({
    isRecurring: true,
    dayOfWeek,
    startTime: '09:00',
    endTime: '17:00',
    isClosed: false,
  }),
);
