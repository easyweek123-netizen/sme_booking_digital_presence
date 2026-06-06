import type { ReactNode } from 'react';
import { UserIcon, UsersIcon } from '../../icons';
import type {
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
  { value: 'APPOINTMENT', title: 'Appointment', sub: '1:1 · bookable slots', icon: <UserIcon size={18} /> },
  { value: 'GROUP', title: 'Event', sub: 'Multiple attendees can book same slot', icon: <UsersIcon size={18} /> },
];

export const PRICE_TYPE_TILES: TileOption<PriceTypeValue>[] = [
  { value: 'FIXED', title: 'Fixed', sub: 'A set price' },
  { value: 'FROM', title: 'Starting at', sub: 'Price varies, shows "from €X"' },
  { value: 'FREE', title: 'Free', sub: 'No payment required' },
  { value: 'ON_REQUEST', title: 'On request', sub: 'Customers request a quote' },
];
