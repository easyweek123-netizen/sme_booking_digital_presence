import { Location, LocationType } from '../entities/location.entity';

export type LocationView =
  | {
      type: LocationType.ADDRESS;
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
  | {
      type: LocationType.PHONE;
      id: number;
      label: string | null;
      phoneNumber: string;
    }
  | {
      type: LocationType.ONLINE;
      id: number;
      label: string | null;
      calendarId: number;
    };

export function toLocationView(l: Location): LocationView {
  const base = { id: l.id, label: l.label };

  switch (l.type) {
    case LocationType.ADDRESS:
      return {
        ...base,
        type: LocationType.ADDRESS,
        line1: l.line1!,
        line2: l.line2 ?? null,
        city: l.city!,
        postalCode: l.postalCode,
        countryCode: l.countryCode!,
        latitude: parseFloat(l.latitude!),
        longitude: parseFloat(l.longitude!),
      };
    case LocationType.PHONE:
      return {
        ...base,
        type: LocationType.PHONE,
        phoneNumber: l.phoneNumber!,
      };
    case LocationType.ONLINE:
      return {
        ...base,
        type: LocationType.ONLINE,
        calendarId: l.calendarId!,
      };
    default: {
      const _exhaustive: never = l.type;
      throw new Error(`Unhandled location type: ${_exhaustive}`);
    }
  }
}
