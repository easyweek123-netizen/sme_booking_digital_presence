import type { Service, WorkingHours, DaySchedule } from '../../types';

export const DAY_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAY_KEY_BY_INDEX: Array<keyof WorkingHours> = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function formatPrice(service: Pick<Service, 'price' | 'priceType'>): string {
  if (service.priceType === 'FREE') return 'Free';
  if (service.priceType === 'ON_REQUEST') return 'On request';
  const amount = service.price ?? '0';
  if (service.priceType === 'FROM') return `from €${amount}`;
  return `€${amount}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return h === 1 ? '1 hr' : `${h} hrs`;
  return `${h} hr ${m} min`;
}

export type LocationMeta = { label: string; iconName: 'globe' | 'phone' | 'pin' };
export function locationMeta(loc: Service['locationType']): LocationMeta {
  if (loc === 'ONLINE') return { label: 'Online', iconName: 'globe' };
  if (loc === 'PHONE') return { label: 'By phone', iconName: 'phone' };
  return { label: 'In-store', iconName: 'pin' };
}

export function getDayKey(dayOfWeek: number): keyof WorkingHours {
  return DAY_KEY_BY_INDEX[dayOfWeek];
}

export type OpenStatus = { open: boolean; line: string };

export function computeOpenStatus(hours: WorkingHours | null | undefined): OpenStatus {
  if (!hours) return { open: false, line: 'Hours unavailable' };
  const now = new Date();
  const todayKey = getDayKey(now.getDay());
  const today = hours[todayKey];
  if (today && today.isOpen) {
    const openMin = toMinutes(today.openTime);
    const closeMin = toMinutes(today.closeTime);
    const cur = now.getHours() * 60 + now.getMinutes();
    if (cur >= openMin && cur < closeMin) {
      return { open: true, line: `Open · closes ${today.closeTime}` };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const dayIdx = (now.getDay() + i) % 7;
    const day = hours[getDayKey(dayIdx)];
    if (day?.isOpen) {
      const label = i === 1 ? 'tomorrow' : DAY_LONG[dayIdx];
      return { open: false, line: `Closed — opens ${label} at ${day.openTime}` };
    }
  }
  return { open: false, line: 'Closed' };
}

function toMinutes(time: string | null | undefined): number {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function orderedWeek(
  hours: WorkingHours | null | undefined,
): Array<{ dayOfWeek: number; day: DaySchedule | null }> {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.map((dayOfWeek) => ({
    dayOfWeek,
    day: hours ? hours[getDayKey(dayOfWeek)] : null,
  }));
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function sameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

export function formatSlotLabel(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function endTimeFromSlot(slot: string, durationMinutes: number): string {
  const match = slot.match(/^(\d{2}):(\d{2})$/);
  if (!match) return slot;
  const total = (parseInt(match[1], 10) * 60 + parseInt(match[2], 10) + durationMinutes) % 1440;
  return formatSlotLabel(Math.floor(total / 60), total % 60);
}

export function formatDateLong(d: Date): string {
  return `${DAY_LONG[d.getDay()]}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

export function formatDateShort(d: Date): string {
  return `${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

export function getInitials(name?: string, max = 2): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, max).toUpperCase();
  return parts
    .slice(0, max)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
