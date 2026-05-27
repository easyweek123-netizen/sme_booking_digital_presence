import type { ReactNode } from 'react';
import { CalendarIcon, MapPinIcon, PhoneIcon, UserIcon, UsersIcon } from '../../icons';
import type {
  LocationTypeValue,
  PriceTypeValue,
  ServiceTypeValue,
} from '../../../types';

export interface TileOption<T extends string = string> {
  value: T;
  title: string;
  sub?: string;
  icon?: ReactNode;
}

export const SERVICE_TYPE_TILES: TileOption<ServiceTypeValue>[] = [
  { value: 'APPOINTMENT', title: 'Appointment', sub: 'One-on-one · bookable slots', icon: <UserIcon size={18} /> },
  { value: 'GROUP', title: 'Group class', sub: 'Multiple attendees · scheduled sessions', icon: <UsersIcon size={18} /> },
];

export const PRICE_TYPE_TILES: TileOption<PriceTypeValue>[] = [
  { value: 'FIXED', title: 'Fixed', sub: 'A set price' },
  { value: 'FROM', title: 'Starting at', sub: 'Price varies, shows "from €X"' },
  { value: 'FREE', title: 'Free', sub: 'No payment required' },
  { value: 'ON_REQUEST', title: 'On request', sub: 'Customers request a quote' },
];

export const LOCATION_TYPE_TILES: TileOption<LocationTypeValue>[] = [
  {
    value: 'AT_BUSINESS',
    title: 'At my place',
    sub: 'Studio · clinic',
    icon: <MapPinIcon size={18} />,
  },
  {
    value: 'ONLINE',
    title: 'Online',
    sub: 'Meet · custom URL',
    icon: <CalendarIcon size={18} />,
  },
  {
    value: 'PHONE',
    title: 'Phone',
    sub: 'Audio call',
    icon: <PhoneIcon size={18} />,
  },
];
