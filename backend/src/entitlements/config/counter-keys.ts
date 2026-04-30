export const CounterKey = {
  ActiveServices: 'active-services',
  MonthlyConfirmedBookings: 'monthly-confirmed-bookings',
} as const;
export type CounterKey = (typeof CounterKey)[keyof typeof CounterKey];
