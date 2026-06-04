import type { LocationDraft } from '@bookeasy/shared';
import type { LocationType, Location } from '../../../../types/location';
import type { AddressInput } from '@bookeasy/shared';
import type { AddressLocation } from '../../../../types/location';

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

export function emptyDraftForType(type: LocationType): LocationDraft {
  switch (type) {
    case 'ADDRESS': return { type: 'ADDRESS', locationId: null, data: null };
    case 'PHONE':   return { type: 'PHONE',   locationId: null, data: null };
    case 'ONLINE':  return { type: 'ONLINE',  locationId: null };
  }
}
