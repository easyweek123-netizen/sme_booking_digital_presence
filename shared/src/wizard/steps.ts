import { type FieldId } from './fields';

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
  fields: FieldId[]; 
  done: (s: SetupState) => boolean 
}

export const STEPS = {
  branding: {
    label: 'Branding', 
    hint: 'Name, look, color, about',
    fields: ['business.name', 'business.tagline', 'business.logo', 'business.brandColor', 'business.cover', 'business.about'] as FieldId[],
    done: (s: SetupState) => !!(s.description || s.brandColor || s.logoUrl || s.coverImageUrl || s.aboutContent),
  },
  business_spot: {
    label: 'Business spot', 
    hint: 'Address & opening hours',
    fields: ['location.address', 'schedule.availability'] as FieldId[],
    done: (s: SetupState) => s.hasAddress,            // hours are seeded at signup
  },
  service: {
    label: 'First service', hint: 'What, when, how much',
    fields: ['service.type', 'service.name', 'service.duration', 'service.price', 'service.description', 'service.location', 'service.hours'] as FieldId[],
    done: (s: SetupState) => s.serviceCount >= 1,
  },
};

export type StepId = keyof typeof STEPS;
export const STEP_IDS = Object.keys(STEPS) as [StepId, ...StepId[]];
export const isStepId = (s: string): s is StepId => s in STEPS;
export const isStepDone = (id: StepId, s: SetupState) => STEPS[id].done(s);