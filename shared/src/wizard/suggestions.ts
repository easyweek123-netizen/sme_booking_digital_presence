import { z } from 'zod';
import type { FieldId } from './fields';

// Fields the assistant may pre-suggest values for when it opens the setup wizard.
// Kept narrow on purpose: only text/number/category inputs that an LLM can fill well.
export const SUGGESTIBLE_FIELD_IDS = [
  'website.tagline',
  'website.about',
  'service.name',
  'service.description',
  'service.category',
  'service.price',
] as const satisfies readonly FieldId[];

export type SuggestibleFieldId = (typeof SUGGESTIBLE_FIELD_IDS)[number];

export const WizardFieldSuggestionSchema = z.object({
  field: z.enum(SUGGESTIBLE_FIELD_IDS),
  value: z.string().min(1),
});
export type WizardFieldSuggestion = z.infer<typeof WizardFieldSuggestionSchema>;

export type WizardSuggestionMap = Partial<Record<FieldId, string>>;

export function toSuggestionMap(
  suggestions?: ReadonlyArray<WizardFieldSuggestion>,
): WizardSuggestionMap {
  const map: WizardSuggestionMap = {};
  for (const s of suggestions ?? []) map[s.field] = s.value;
  return map;
}
