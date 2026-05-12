/**
 * Combine a date column + 'HH:MM:SS' time into a local ISO datetime
 * (no timezone offset). Caller supplies the tz separately when needed.
 *
 * Handles both string-typed (mysql) and Date-typed (postgres) date columns.
 */
export function toLocalIsoDateTime(date: Date | string, time: string): string {
  const dateStr =
    typeof date === 'string'
      ? date.slice(0, 10)
      : new Date(date).toISOString().slice(0, 10);
  return `${dateStr}T${time}`;
}
