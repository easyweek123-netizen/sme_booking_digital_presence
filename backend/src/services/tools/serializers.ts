import type { Service } from '../entities/service.entity';
import type { ServiceListItem, LocationType } from '@bookeasy/shared';

export function toServiceListItem(s: Service): ServiceListItem {
  return {
    id: s.id,
    name: s.name,
    type: s.type,
    description: s.description ?? null,
    durationMinutes: s.durationMinutes,
    price: s.price !== null && s.price !== undefined ? String(s.price) : null,
    priceType: s.priceType,
    locationType: s.locationType as unknown as LocationType,
    capacity: s.capacity,
    isActive: s.isActive,
    imageUrl: s.photoUrl ?? null,
  };
}
