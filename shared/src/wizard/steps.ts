import { type FieldId } from './fields';

export type StepIconKey = 'sparkle' | 'map_pin' | 'scissors';

export interface BusinessProfileCompletion {
  description?: string | null;
  brandColor?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  aboutContent?: string | null;
  locations?: ReadonlyArray<{ type: string }> | null;
  services?: ReadonlyArray<unknown> | null;
}

export interface SetupState {
  name?: string | null; 
  description?: string | null; 
  brandColor?: string | null;
  logoUrl?: string | null; 
  coverImageUrl?: string | null; 
  aboutContent?: string | null;
  hasAddress: boolean; 
  serviceCount: number;
}
export interface StepDef {
  label: string;
  hint: string;
  icon: StepIconKey;
  fields: FieldId[][];
  done: (b: BusinessProfileCompletion) => boolean;
}

export const STEPS = {
  branding: {
    label: 'Branding', 
    hint: 'Logo, cover, color, about',
    icon: 'sparkle',
    fields: [
      ['website.name', 'website.tagline'],
      ['website.logo', 'website.brandColor', 'website.cover'],
      ['website.about'],
    ] as FieldId[][],
    done: (b: BusinessProfileCompletion) => !!(b?.description || b?.brandColor || b?.logoUrl || b?.coverImageUrl || b?.aboutContent),
  },
  business_spot: {
    label: 'Business spot', 
    hint: 'Address & opening hours',
    icon: 'map_pin',
    fields: [['website.address'], ['website.availability'], ['website.visibility']] as FieldId[][],
    done: (b: BusinessProfileCompletion) => (b?.locations ?? []).some((l) => l.type === 'ADDRESS'),
  },
  service: {
    label: 'First service', 
    hint: 'What, when, how much',
    icon: 'scissors',
    fields: [
      ['service.type', 'service.name', 'service.duration', 'service.price'],
      ['service.description', 'service.category'],
      ['service.location'],
      ['service.hours'],
    ] as FieldId[][],
    done: (b: BusinessProfileCompletion) => (b?.services?.length ?? 0) >= 1,
  },
};

export type StepId = keyof typeof STEPS;
export const STEP_IDS = Object.keys(STEPS) as [StepId, ...StepId[]];
export const isStepId = (s: string): s is StepId => s in STEPS;
export const isStepDone = (id: StepId, b: BusinessProfileCompletion) => STEPS[id].done(b);