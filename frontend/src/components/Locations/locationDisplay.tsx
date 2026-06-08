import type { ComponentType } from 'react';
import { MapPinIcon, PhoneIcon, VideoIcon } from '../icons';
import type { Location, LocationType } from '../../types/location';

export type LocationTypeIconName = 'pin' | 'phone' | 'globe';

export interface LocationTypePresentation {
  typeLabel: string;
  description: string;
  Icon: ComponentType<{ size?: number }>;
  iconName: LocationTypeIconName;
}

export const LOCATION_TYPE_PRESENTATION = {
  ADDRESS: { typeLabel: 'In person', description: 'Customers visit a physical address', Icon: MapPinIcon, iconName: 'pin'   },
  PHONE:   { typeLabel: 'By phone',  description: 'Service delivered over a call',      Icon: PhoneIcon,  iconName: 'phone' },
  ONLINE:  { typeLabel: 'Online',    description: 'Via a connected calendar',           Icon: VideoIcon,  iconName: 'globe' },
} as const satisfies Record<LocationType, LocationTypePresentation>;

export function locationIcon(type: LocationType, size = 16) {
  const { Icon } = LOCATION_TYPE_PRESENTATION[type];
  return <Icon size={size} />;
}

export function locationTypeLabel(type: LocationType): string {
  return LOCATION_TYPE_PRESENTATION[type].typeLabel;
}

export function locationDetail(loc: Location): string {
  switch (loc.type) {
    case 'ADDRESS': return [loc.line1, loc.line2, loc.city].filter(Boolean).join(', ');
    case 'PHONE':   return loc.phoneNumber;
    case 'ONLINE':  return 'Online meeting';
  }
}

export function locationLabel(loc: Location): string {
  return locationDetail(loc) || locationTypeLabel(loc.type);
}
