import { theme } from '../../../theme';
import type { Service } from '../../../types';
import type { ServiceDraft } from '../types';
import { locationFromDraft } from '../locations/shared/locationDraft';

export const SERVICE_ACCENT_FALLBACK = theme.colors.brand[500] as string;

export function getServiceAccent(service: { color?: string | null }): string {
  return service.color ?? SERVICE_ACCENT_FALLBACK;
}

export const LocationType = {
  ONLINE: 'online',
  PHONE: 'phone',
  IN_PERSON: 'in_person',
} as const;

export type LocationType = typeof LocationType[keyof typeof LocationType] | null;

const RAW_TO_LOCATION_TYPE: Record<string, LocationType> = {
  ONLINE: LocationType.ONLINE,
  PHONE: LocationType.PHONE,
  ADDRESS: LocationType.IN_PERSON,
  IN_PERSON: LocationType.IN_PERSON,
};

export function getLocationType(s: Pick<Service, 'location'>): LocationType {
  const raw = (s.location as { type?: string } | null | undefined)?.type;
  if (!raw) return null;
  return RAW_TO_LOCATION_TYPE[raw.toUpperCase()] ?? LocationType.IN_PERSON;
}

export function getLocationLabel(t: LocationType): string {
  if (t === LocationType.ONLINE)    return 'Online';
  if (t === LocationType.PHONE)     return 'By phone';
  if (t === LocationType.IN_PERSON) return 'In person';
  return '';
}

export function getDaysLabel(schedule?: Service['schedule']): string {
  if (!schedule) return '';
  const weeklyHours = (schedule as { weeklyHours?: Record<string, { length?: number }[]> }).weeklyHours;
  if (!weeklyHours) return '';
  const order = ['mon','tue','wed','thu','fri','sat','sun'];
  const active = order.filter(d => weeklyHours[d]?.length);
  if (active.length === 0) return '';
  if (active.length === 7) return 'Every day';
  const idx = active.map(d => order.indexOf(d));
  const contiguous = idx.every((v,i,a) => i === 0 || v === a[i-1] + 1);
  const cap = (d: string) => d[0].toUpperCase() + d.slice(1);
  if (contiguous && active.length > 2) return `${cap(active[0])}–${cap(active.at(-1)!)}`;
  return active.map(cap).join(' · ');
}

export function getCapacityLabel(s: Pick<Service, 'type' | 'capacity'>): string {
  return s.type === 'GROUP' ? 'Group' : '1-on-1';
}

export function getSpotsLabel(s: Pick<Service, 'type' | 'capacity'>): string | null {
  if (s.type !== 'GROUP' || !s.capacity) return null;
  return `${s.capacity} spots`;
}

export function darken(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const r = Math.max(0, parseInt(h.slice(0, 2), 16) * (1 - amt)) | 0;
  const g = Math.max(0, parseInt(h.slice(2, 4), 16) * (1 - amt)) | 0;
  const b = Math.max(0, parseInt(h.slice(4, 6), 16) * (1 - amt)) | 0;
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

export function servicePreviewDraft(draft: ServiceDraft, serviceId: number | undefined): Service {
  const locType = draft.location?.type ?? null;
  return {
    id: serviceId ?? undefined,
    name: draft.name?.trim() || 'Service name',
    description: draft.description ?? '',
    durationMinutes: draft.durationMinutes ?? 30,
    price: draft.price ?? 0,
    priceType: draft.priceType ?? 'FIXED',
    type: draft.type === 'GROUP' ? 'GROUP' : 'APPOINTMENT',
    capacity: draft.capacity ?? 1,
    color: draft.color ?? null,
    photoUrl: draft.photoUrl ?? null,
    location: locationFromDraft(draft.location),
    activeLocationKind: locType,
    isActive: true,
  } as unknown as Service;
}
