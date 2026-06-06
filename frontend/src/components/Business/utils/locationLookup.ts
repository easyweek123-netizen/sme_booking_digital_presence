import type { Business } from '../../../types';
import type {
  Location,
  AddressLocation,
  PhoneLocation,
  OnlineLocation,
  LocationType,
} from '../../../types/location';

type LocationByType = {
  ADDRESS: AddressLocation;
  PHONE: PhoneLocation;
  ONLINE: OnlineLocation;
};

export function findBusinessLocation<T extends LocationType>(
  business: Pick<Business, 'locations'>,
  type: T,
): LocationByType[T] | null {
  const match = business.locations?.find((l): l is LocationByType[T] => l.type === type);
  return match ?? null;
}

export function businessAddressLocation(
  business: Pick<Business, 'locations'>,
): AddressLocation | null {
  return findBusinessLocation(business, 'ADDRESS');
}

export function businessPhoneNumber(
  business: Pick<Business, 'locations'>,
): string | null {
  return findBusinessLocation(business, 'PHONE')?.phoneNumber ?? null;
}

/**
 * "{street}, {city}" — empty string when no address location.
 */
export function businessAddressLine(
  business: Pick<Business, 'locations'>,
): string {
  const a = businessAddressLocation(business);
  if (!a) return '';
  return [a.line1, a.city].filter(Boolean).join(', ');
}

export type { Location };
