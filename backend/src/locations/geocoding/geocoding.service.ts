import { Inject, Injectable } from '@nestjs/common';
import { Entry, Geocoder } from 'node-geocoder';
import { GEOCODER } from './geocoder.provider';

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

@Injectable()
export class GeocodingService {
  constructor(@Inject(GEOCODER) private readonly geocoder: Geocoder) {}

  async search(q: string): Promise<AddressCandidate[]> {
    if (!q?.trim()) return [];
    const results = await this.geocoder.geocode({ q, limit: 5 } as never);
    return results.filter(hasCoords).map(toAddress);
  }

  async reverse(lat: number, lon: number): Promise<AddressCandidate | null> {
    const results = await this.geocoder.reverse({ lat, lon });
    const first = results.find(hasCoords);
    return first ? toAddress(first) : null;
  }
}

function hasCoords(e: Entry): boolean {
  return typeof e.latitude === 'number' && typeof e.longitude === 'number';
}

function toAddress(e: Entry): AddressCandidate {
  const line1 =
    [e.streetNumber, e.streetName].filter(Boolean).join(' ') ||
    (e.formattedAddress?.split(',')[0] ?? '');
  return {
    displayName: e.formattedAddress ?? '',
    line1,
    city: e.city ?? '',
    postalCode: e.zipcode ?? null,
    countryCode: (e.countryCode ?? '').toUpperCase(),
    countryName: e.country ?? null,
    latitude: e.latitude as number,
    longitude: e.longitude as number,
  };
}
