import type { Business } from '../../business/entities/business.entity';
import type { LocationView } from './location-view';
import { LocationType } from '../entities/location.entity';

type WithLocations = { locations?: Array<LocationView | { type: string }> | null };

function asViews(business: Business): LocationView[] {
  // After Phase 2, BusinessService.loadBusiness() always projects
  // `locations` to LocationView. Defensive cast for callers that hit raw
  // entities (e.g. relations loaded outside loadBusiness).
  return ((business as WithLocations).locations ?? []) as LocationView[];
}

export function findBusinessLocation<T extends LocationType>(
  business: Business,
  type: T,
): Extract<LocationView, { type: T }> | null {
  const match = asViews(business).find((l) => l.type === type);
  return (match ?? null) as Extract<LocationView, { type: T }> | null;
}

export function businessAddressLine(business: Business): string | null {
  const a = findBusinessLocation(business, LocationType.ADDRESS);
  if (!a) return null;
  return [a.line1, a.city].filter(Boolean).join(', ');
}

export function businessAddressCity(business: Business): { line1: string; city: string } | null {
  const a = findBusinessLocation(business, LocationType.ADDRESS);
  return a ? { line1: a.line1, city: a.city } : null;
}

export function businessPhoneNumber(business: Business): string | null {
  const p = findBusinessLocation(business, LocationType.PHONE);
  return p?.phoneNumber ?? null;
}
