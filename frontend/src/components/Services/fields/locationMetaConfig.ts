import type { Business, LocationTypeValue, Service } from '../../../types';

export interface LocationMetaFieldConfig {
  metaKey: 'address' | 'phone';
  placeholder: string;
  type?: string;
  isRequired: boolean;
  getDefault: (business: Business) => string;
}

export const LOCATION_META_FIELD_CONFIG: Partial<
  Record<LocationTypeValue, LocationMetaFieldConfig>
> = {
  AT_BUSINESS: {
    metaKey: 'address',
    placeholder: 'Business address',
    isRequired: true,
    getDefault: (b) => [b.address, b.city].filter(Boolean).join(', '),
  },
  PHONE: {
    metaKey: 'phone',
    placeholder: 'Phone number',
    type: 'tel',
    isRequired: true,
    getDefault: (b) => b.phone ?? '',
  },
};

export function resolveLocationMeta(
  type: LocationTypeValue | undefined,
  business: Business,
  current?: Service['locationMeta'],
): Service['locationMeta'] | null {
  if (!type) return current ?? null;
  const cfg = LOCATION_META_FIELD_CONFIG[type];
  if (!cfg) return current ?? null; // e.g. ONLINE — leave untouched
  
  const base = (current as Record<string, unknown> | null | undefined) ?? {};
  const existing = base[cfg.metaKey] as string | undefined;
  const value = existing && existing.trim() !== '' ? existing : cfg.getDefault(business);
  return { ...base, [cfg.metaKey]: value } as Service['locationMeta'];
}
