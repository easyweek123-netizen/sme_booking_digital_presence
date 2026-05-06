export const CounterKey = {
  ActiveServices: 'active-services',
  MonthlyConfirmedBookings: 'monthly-confirmed-bookings',
  ChatThreads: 'chat-threads',
} as const;
export type CounterKey = (typeof CounterKey)[keyof typeof CounterKey];
