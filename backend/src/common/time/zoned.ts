const PARTS_CACHE = new Map<string, Intl.DateTimeFormat>();

function partsFmt(tz: string): Intl.DateTimeFormat {
  let f = PARTS_CACHE.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short',
    });
    PARTS_CACHE.set(tz, f);
  }
  return f;
}

function getZonedParts(d: Date, tz: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of partsFmt(tz).formatToParts(d)) {
    if (p.type !== 'literal') out[p.type] = p.value;
  }
  return out;
}

const DOW_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function dayOfWeekInTz(date: string, tz: string): number {
  const probe = wallTimeToInstant(date, '12:00', tz);
  const parts = getZonedParts(probe, tz);
  return DOW_MAP[parts.weekday];
}

export function wallTimeToInstant(
  date: string,
  time: string,
  tz: string,
): Date {
  const [Y, M, D] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const target = `${date}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  const wallKey = (ms: number) => {
    const w = instantToWall(new Date(ms), tz);
    return `${w.date}T${w.time.slice(0, 5)}`;
  };
  let lo = Date.UTC(Y, M - 1, D - 1, 0, 0, 0);
  let hi = Date.UTC(Y, M - 1, D + 1, 23, 59, 59);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (wallKey(mid) < target) lo = mid + 1;
    else hi = mid;
  }
  return new Date(lo);
}

export function instantToWall(
  d: Date,
  tz: string,
): { date: string; time: string } {
  const p = getZonedParts(d, tz);
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    time: `${p.hour}:${p.minute}`,
  };
}

export function eachDateInRange(
  range: { from: string; to: string },
  _tz: string,
): string[] {
  const out: string[] = [];
  let cur = range.from;
  const end = range.to;
  while (true) {
    out.push(cur);
    if (cur === end) break;
    const [y, m, d] = cur.split('-').map(Number);
    const nd = new Date(Date.UTC(y, m - 1, d + 1));
    cur = `${nd.getUTCFullYear()}-${String(nd.getUTCMonth() + 1).padStart(2, '0')}-${String(nd.getUTCDate()).padStart(2, '0')}`;
    if (cur > end) break;
  }
  return out;
}

function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fromMin(n: number): string {
  const h = Math.floor(n / 60)
    .toString()
    .padStart(2, '0');
  const m = (n % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function subdivide(
  window: { start: string; end: string },
  durationMinutes: number,
  pauseAfterMinutes: number,
): { start: string; end: string }[] {
  const s = toMin(window.start);
  const e = toMin(window.end);
  const step = durationMinutes + Math.max(0, pauseAfterMinutes);
  const out: { start: string; end: string }[] = [];
  for (let cur = s; cur + durationMinutes <= e; cur += step) {
    out.push({ start: fromMin(cur), end: fromMin(cur + durationMinutes) });
  }
  return out;
}
