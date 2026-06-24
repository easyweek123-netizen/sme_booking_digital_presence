import { GROUP, type Group } from './constants';

export interface FieldDef { label: string; required?: boolean; helpText?: string }

export const FIELDS = {
  [GROUP.WEBSITE]: {
    name:       { label: 'Business name', required: true },
    tagline:    { label: 'Tagline', helpText: 'One line shown under your name.' },
    about:      { label: 'About' },
    logo:       { label: 'Logo' },
    brandColor: { label: 'Brand color' },
    cover:      { label: 'Cover image' },
    website:    { label: 'Website' },
    instagram:  { label: 'Instagram' },
    address:    { label: 'Address', required: true },
    phone:      { label: 'Phone' },
    availability: { label: 'Opening hours' },
  },
  [GROUP.SERVICE]: {
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
} satisfies Record<Group, Record<string, FieldDef>>;

export type FieldId = { [G in Group]: `${G}.${Extract<keyof typeof FIELDS[G], string>}` }[Group];
export const FIELD_IDS = Object.entries(FIELDS).flatMap(
  ([g, defs]) => Object.keys(defs).map((n) => `${g}.${n}`),
) as [FieldId, ...FieldId[]];
export const groupOf = (id: FieldId): Group => id.split('.')[0] as Group;
export const isFieldId = (s: string): s is FieldId => (FIELD_IDS as string[]).includes(s);
export function fieldDef(id: FieldId): FieldDef {
  const [g, n] = id.split('.') as [Group, string];
  return (FIELDS[g] as Record<string, FieldDef>)[n];
}