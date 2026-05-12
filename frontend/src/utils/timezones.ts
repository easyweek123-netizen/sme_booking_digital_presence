export function getSupportedTimezones(): string[] {
  // Modern browsers/Node 18+ expose this. Fallback to a curated short list
  // if the API isn't available.
  const intlAny = Intl as unknown as { supportedValuesOf?: (k: string) => string[] };
  if (typeof intlAny.supportedValuesOf === 'function') {
    return intlAny.supportedValuesOf('timeZone');
  }
  return [
    'UTC',
    'Europe/Vienna',
    'Europe/Berlin',
    'Europe/Zurich',
    'Europe/London',
    'America/New_York',
    'America/Chicago',
    'America/Los_Angeles',
    'Asia/Dubai',
    'Asia/Karachi',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];
}

export function detectBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Vienna';
}

export function formatTimezoneLabel(tz: string): string {
  // Returns "Europe/Vienna (UTC+02:00)"
  const offset =
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value ?? '';
  return `${tz}${offset ? ` (${offset})` : ''}`;
}
