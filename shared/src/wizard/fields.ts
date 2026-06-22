import { ENTITY, type Entity } from './constants';

export interface FieldDef { label: string; required?: boolean; helpText?: string }

export const FIELDS = {
  [ENTITY.BUSINESS]: {
    name:       { label: 'Business name', required: true },
    tagline:    { label: 'Tagline', helpText: 'One line shown under your name.' },
    about:      { label: 'About' },
    logo:       { label: 'Logo' },
    brandColor: { label: 'Brand color' },
    cover:      { label: 'Cover image' },
    website:    { label: 'Website' },
    instagram:  { label: 'Instagram' },
  },
  [ENTITY.LOCATION]: { 
    address: { label: 'Address', required: true }, 
    phone: { label: 'Phone' } 
  },
  [ENTITY.SCHEDULE]: { availability: { label: 'Opening hours' } },
  [ENTITY.SERVICE]: {
    type: { label: 'Service type' }, 
    name: { label: 'Service name', required: true },
    duration: { label: 'Duration' }, 
    price: { label: 'Price' }, 
    pause: { label: 'Pause after' },
    description: { label: 'Description' }, 
    color: { label: 'Color' }, 
    photo: { label: 'Photo' },
    category: { label: 'Category' }, 
    location: { label: 'Location' }, 
    hours: { label: 'Availability' },
  },
} satisfies Record<Entity, Record<string, FieldDef>>;

export type FieldId = { [E in Entity]: `${E}.${Extract<keyof typeof FIELDS[E], string>}` }[Entity];
export const FIELD_IDS = Object.entries(FIELDS).flatMap(
  ([e, defs]) => Object.keys(defs).map((n) => `${e}.${n}`),
) as [FieldId, ...FieldId[]];
export const entityOf = (id: FieldId): Entity => id.split('.')[0] as Entity;
export const isFieldId = (s: string): s is FieldId => (FIELD_IDS as string[]).includes(s);
export function fieldDef(id: FieldId): FieldDef {
  const [e, n] = id.split('.') as [Entity, string];
  return (FIELDS[e] as Record<string, FieldDef>)[n];
}