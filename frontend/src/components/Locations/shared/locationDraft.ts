import type { LocationDraft } from '@bookeasy/shared';
import type { AddressInput } from '@bookeasy/shared';
import type { AddressLocation, Location, LocationType } from '../../../types/location';

function addressLocationToInput(l: AddressLocation): AddressInput {
  return {
    displayName: [l.line1, l.city].filter(Boolean).join(', '),
    line1: l.line1,
    line2: l.line2 ?? null,
    city: l.city,
    postalCode: l.postalCode,
    countryCode: l.countryCode,
    countryName: null,
    latitude: l.latitude,
    longitude: l.longitude,
  };
}
export function locationToDraft(loc: Location | null | undefined): LocationDraft | null {
  if (!loc) return null;
  switch (loc.type) {
    case 'ADDRESS': return { type: 'ADDRESS', locationId: loc.id, data: addressLocationToInput(loc) };
    case 'PHONE':   return { type: 'PHONE',   locationId: loc.id, data: { phoneNumber: loc.phoneNumber } };
    case 'ONLINE':  return { type: 'ONLINE',  locationId: loc.id };
  }
}

/**
 * Inverse of `locationToDraft`. Converts a form draft (write shape) back into
 * the read `Location` shape that `Service.location` carries at runtime.
 * Used by the live preview so the rendered Service matches the booking-page
 * response shape. Returns null if the draft cannot be materialized as a real
 * location yet (e.g. address picker not filled).
 */
export function locationFromDraft(draft: LocationDraft | null | undefined): Location | null {
  if (!draft) return null;
  switch (draft.type) {
    case 'ADDRESS':
      if (!draft.data) return null;
      return {
        type: 'ADDRESS',
        id: draft.locationId ?? 0,
        label: null,
        line1: draft.data.line1,
        line2: draft.data.line2,
        city: draft.data.city,
        postalCode: draft.data.postalCode,
        countryCode: draft.data.countryCode,
        latitude: draft.data.latitude,
        longitude: draft.data.longitude,
      } satisfies AddressLocation;
    case 'PHONE':
      if (!draft.data) return null;
      return {
        type: 'PHONE',
        id: draft.locationId ?? 0,
        label: null,
        phoneNumber: draft.data.phoneNumber,
      };
    case 'ONLINE':
      return {
        type: 'ONLINE',
        id: draft.locationId ?? 0,
        label: null,
        calendarId: 0,
      };
  }
}

export function emptyDraftForType(type: LocationType): LocationDraft {
  switch (type) {
    case 'ADDRESS': return { type: 'ADDRESS', locationId: null, data: null };
    case 'PHONE':   return { type: 'PHONE',   locationId: null, data: null };
    case 'ONLINE':  return { type: 'ONLINE',  locationId: null };
  }
}
