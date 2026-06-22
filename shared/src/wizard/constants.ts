const valuesOf = <T extends Record<string, string>>(o: T) =>
  Object.values(o) as [T[keyof T], ...T[keyof T][]];

export const ENTITY = { 
  BUSINESS: 'business', 
  LOCATION: 'location', 
  SCHEDULE: 'schedule', 
  SERVICE: 'service' 
} as const;

/** One save mutation per entity (the entity IS the save group). */
export const ENTITY_MUTATION = {
  [ENTITY.BUSINESS]: 'business:update',
  [ENTITY.LOCATION]: 'location:save',
  [ENTITY.SCHEDULE]: 'schedule:update',
  [ENTITY.SERVICE]:  'service:save',
} as const;

export type Entity = (typeof ENTITY)[keyof typeof ENTITY];
export const ENTITIES = valuesOf(ENTITY);