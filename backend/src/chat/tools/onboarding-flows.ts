import { ONBOARDING_PRESETS, type OnboardingPreset, type ProgressCard } from '@bookeasy/shared';
import type { Business } from '../../business/entities/business.entity';
import { businessAddressCity } from '../../locations/types/business-location-lookup';

export const FLOW_META: Record<OnboardingPreset, { label: string; hint: string; submitAction: string }> = {
  branding: { label: 'Branding',      hint: 'Name, look, color, about', submitAction: 'business:update' },
  location: { label: 'Business spot', hint: 'Address & opening hours',  submitAction: 'business:update' },
  service:  { label: 'First service', hint: 'What, when, how much',     submitAction: 'service:create' },
};

export function isFlowDone(preset: OnboardingPreset, business: Business | null): boolean {
  if (!business) return false;
  switch (preset) {
    case 'branding':
      return !!(business.description || business.brandColor || business.logoUrl ||
                business.coverImageUrl || business.aboutContent);
    case 'location':
      return !!businessAddressCity(business);          // hours are seeded by default
    case 'service':
      return (business.services?.length ?? 0) >= 1;
  }
}

/** Domain done-state keyed by preset (mirrors the prototype's `derivedProgress`).
 *  Used by show_tiles + onboardingGuidance. */
export function computeFlowProgress(business: Business | null): Record<OnboardingPreset, boolean> {
  return Object.fromEntries(
    ONBOARDING_PRESETS.map((preset) => [preset, isFlowDone(preset, business)]),
  ) as Record<OnboardingPreset, boolean>;
}

/** Presentational flows for the progress card. Return type is the indexed access
 *  `ProgressCard['flows']` (ProgressCard is already exported), so no standalone
 *  `ProgressFlow` type needs to leave shared. Used by show_progress. */
export function buildProgressFlows(business: Business | null): ProgressCard['flows'] {
  const done = computeFlowProgress(business);
  return ONBOARDING_PRESETS.map((preset) => ({
    id: preset,
    label: FLOW_META[preset].label,
    hint: FLOW_META[preset].hint,
    done: done[preset],
  }));
}