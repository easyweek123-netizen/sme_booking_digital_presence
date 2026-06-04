import { Location } from '../entities/location.entity';

/**
 * Human-readable text suitable for a calendar event's `location` field and
 * email confirmation rows. Returns undefined for ONLINE (the Meet link is
 * handled separately) so callers can fall back to a meet/Meet link.
 */
export function locationToCalendarText(
  loc: Location | null | undefined,
): string | undefined {
  if (!loc) return undefined;
  if (loc.type === 'ONLINE') return undefined;
  if (loc.type === 'PHONE') return `Phone: ${loc.phoneNumber}`;
  return [loc.line1, loc.line2, loc.city, loc.postalCode, loc.countryCode]
    .filter(Boolean)
    .join(', ');
}
