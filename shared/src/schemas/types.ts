export const SERVICE_TYPES = ['APPOINTMENT', 'GROUP'] as const;
export type ServiceType = typeof SERVICE_TYPES[number];

export const PRICE_TYPES = ['FIXED', 'FROM', 'FREE', 'ON_REQUEST'] as const;
export type PriceType = typeof PRICE_TYPES[number];

export const LOCATION_TYPES = ['ADDRESS', 'PHONE', 'ONLINE'] as const;
export type LocationType = typeof LOCATION_TYPES[number];
