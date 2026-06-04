export type {
  AddressInput,
  PhoneInput,
  CreatingLocation,
} from '@bookeasy/shared';

export type LocationType = 'ADDRESS' | 'PHONE' | 'ONLINE';

export interface AddressLocation {
  type: 'ADDRESS';
  id: number;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  postalCode: string | null;
  countryCode: string;
  latitude: number;
  longitude: number;
}

export interface PhoneLocation {
  type: 'PHONE';
  id: number;
  label: string | null;
  phoneNumber: string;
}

export interface OnlineLocation {
  type: 'ONLINE';
  id: number;
  label: string | null;
  calendarId: number;
}

export type Location = AddressLocation | PhoneLocation | OnlineLocation;

export interface AddressCandidate {
  displayName: string;
  line1: string;
  city: string;
  postalCode: string | null;
  countryCode: string;
  countryName: string | null;
  latitude: number;
  longitude: number;
}
