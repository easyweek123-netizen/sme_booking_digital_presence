const UNITS: { ms: number; label: Intl.RelativeTimeFormatUnit }[] = [
  { ms: 60_000, label: 'second' },
  { ms: 3_600_000, label: 'minute' },
  { ms: 86_400_000, label: 'hour' },
  { ms: 604_800_000, label: 'day' },
  { ms: 2_629_800_000, label: 'week' },
  { ms: Infinity, label: 'month' },
];

const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function formatRelativeTime(iso: string | null): string | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  for (let i = 0; i < UNITS.length; i++) {
    const next = UNITS[i];
    if (abs < next.ms) {
      const divisor = i === 0 ? 1000 : UNITS[i - 1].ms;
      return formatter.format(Math.round(diff / divisor), next.label);
    }
  }
  return null;
}
