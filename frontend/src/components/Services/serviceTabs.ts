import type { DashboardTabSpec } from '../Dashboard';

export type ServiceTabKey = 'basic' | 'availability' | 'pricing';

export const SERVICE_TABS: ReadonlyArray<DashboardTabSpec<ServiceTabKey>> = [
  { key: 'basic', label: 'Basic' },
  { key: 'availability', label: 'Availability' },
  { key: 'pricing', label: 'Pricing' },
];
