import { DAY_SHORT } from '../utils';

const HHMM = (d: Date) => d.toTimeString().slice(0, 5);

export function formatRelativeSlot(iso: string, _tz: string): string {
  const slot = new Date(iso);
  const now = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (sameDay(slot, now)) return `Today · ${HHMM(slot)}`;
  if (sameDay(slot, tomorrow)) return `Tomorrow · ${HHMM(slot)}`;
  return `${DAY_SHORT[slot.getDay()]} · ${HHMM(slot)}`;
}
