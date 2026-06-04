import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import NodeGeocoder, { Geocoder } from 'node-geocoder';

export const GEOCODER = Symbol('GEOCODER');

export const geocoderProvider: Provider = {
  provide: GEOCODER,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Geocoder =>
    NodeGeocoder({
      provider: 'openstreetmap',
      // OSM usage policy requires a contactable identity.
      email: config.get<string>('GEOCODER_CONTACT_EMAIL'),
      language: 'en',
    }),
};
