import type { AddressInput } from '@bookeasy/shared';
import type { AddressLocation } from '../../../types/location';

export function addressLocationToInput(l: AddressLocation): AddressInput {
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
