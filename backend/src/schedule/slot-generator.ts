import {
  dayOfWeekInTz,
  eachDateInRange,
  subdivide,
  wallTimeToInstant,
} from '../common/time/zoned';

export interface AvailabilityRow {
  isRecurring: boolean;
  dayOfWeek: number | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  isClosed: boolean;
}

export interface Service {
  id: number;
  type: 'APPOINTMENT' | 'GROUP';
  capacity: number;
  durationMinutes: number;
  pauseAfterMinutes: number;
}

export interface BookingRow {
  serviceId: number;
  date: string;
  startTime: string;
}

export interface Slot {
  date: string;
  startTime: string;
  endTime: string;
  seatsRemaining: number;
  capacity: number;
}

export function resolveWindowsForDate(
  availabilities: AvailabilityRow[],
  date: string,
  tz: string,
): { start: string; end: string }[] {
  const overrides = availabilities.filter(
    (a) => !a.isRecurring && a.date === date,
  );
  if (overrides.length > 0) {
    if (overrides.some((o) => o.isClosed)) return [];
    return overrides
      .filter((o) => o.startTime && o.endTime)
      .map((o) => ({ start: o.startTime as string, end: o.endTime as string }));
  }
  const dow = dayOfWeekInTz(date, tz);
  return availabilities
    .filter(
      (a) => a.isRecurring && a.dayOfWeek === dow && a.startTime && a.endTime,
    )
    .map((a) => ({ start: a.startTime as string, end: a.endTime as string }));
}

function ymd(d: string): string {
  return d;
}

export function getAvailableSlots(
  service: Service,
  availabilities: AvailabilityRow[],
  range: { from: string; to: string },
  existingBookings: BookingRow[],
  now: Date,
  tz: string,
): Slot[] {
  const out: Slot[] = [];
  for (const date of eachDateInRange(range, tz)) {
    const windows = resolveWindowsForDate(availabilities, date, tz);
    for (const w of windows) {
      const slots =
        service.type === 'APPOINTMENT'
          ? subdivide(w, service.durationMinutes, service.pauseAfterMinutes)
          : [{ start: w.start, end: w.end }];
      for (const s of slots) {
        if (wallTimeToInstant(date, s.start, tz).getTime() <= now.getTime())
          continue;
        const booked = existingBookings.filter(
          (b) =>
            b.serviceId === service.id &&
            ymd(b.date) === date &&
            b.startTime === s.start,
        ).length;
        const seatsRemaining = service.capacity - booked;
        if (seatsRemaining <= 0) continue;
        out.push({
          date,
          startTime: s.start,
          endTime: s.end,
          seatsRemaining,
          capacity: service.capacity,
        });
      }
    }
  }
  return out;
}
