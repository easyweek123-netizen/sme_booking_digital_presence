/**
 * Server-local calendar formatting (Node process timezone).
 * Single source of truth for YYYY-MM-DD used by bookings and assistant tools.
 */
export function formatLocalYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface ServerClockSnapshot {
  dateIso: string;
  dateDisplay: string;
  isoTimestamp: string;
}

export function getServerClockSnapshot(now: Date = new Date()): ServerClockSnapshot {
  return {
    dateIso: formatLocalYmd(now),
    dateDisplay: now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    isoTimestamp: now.toISOString(),
  };
}
