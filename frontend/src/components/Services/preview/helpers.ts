import type {
  AvailabilityInput,
  PriceTypeValue,
} from '../../../types';

export const STRIPE_BG =
  'repeating-linear-gradient(45deg, #E8E1D0 0 12px, #DCD2BB 12px 24px)';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatPrice(
  price: string | null | undefined,
  type: PriceTypeValue | undefined,
): string {
  if (type === 'FREE') return 'Free';
  if (type === 'ON_REQUEST') return 'On request';
  if (!price) return '—';
  const n = Number(price);
  const formatted = Number.isInteger(n) ? `€${n}` : `€${n.toFixed(2)}`;
  return type === 'FROM' ? `from ${formatted}` : formatted;
}

export function recurringDayLabels(
  availability: AvailabilityInput[] | undefined,
): string[] {
  if (!availability?.length) return [];
  const dows = new Set<number>();
  for (const a of availability) {
    if (a.isRecurring && typeof a.dayOfWeek === 'number') dows.add(a.dayOfWeek);
  }
  return Array.from(dows)
    .sort((a, b) => a - b)
    .map((d) => DAY_NAMES[d]);
}

export function classTimeLabels(availability: AvailabilityInput[] | undefined): string[] {
  if (!availability?.length) return [];
  return availability
    .filter(
      (a) =>
        a.isRecurring &&
        typeof a.dayOfWeek === 'number' &&
        a.startTime &&
        a.endTime,
    )
    .map(
      (a) =>
        `${DAY_NAMES[a.dayOfWeek as number]} ${a.startTime}–${a.endTime}`,
    );
}
