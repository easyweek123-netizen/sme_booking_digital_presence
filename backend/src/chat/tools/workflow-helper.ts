import { randomUUID } from 'crypto';
import type { Business } from '../../business/entities/business.entity';
import { businessAddressCity } from '../../locations/types/business-location-lookup';
import {
  FIELDS, STEPS, WORKFLOWS, selectActiveWorkflowId, isWorkflowDone,
  toSuggestionMap,
  type SetupState, type WorkflowId, type FieldId,
  type Wizard, type SummaryCard, type FieldDef,
  type BusinessProfileCompletion, type WizardFieldSuggestion,
  StepIconKey,
} from '@bookeasy/shared';

export function toSetupState(b: Business | null): SetupState {
  return {
    name: b?.name, description: b?.description, 
    brandColor: b?.brandColor, 
    logoUrl: b?.logoUrl,
    coverImageUrl: b?.coverImageUrl, 
    aboutContent: b?.aboutContent,
    hasAddress: !!(b && businessAddressCity(b)), 
    serviceCount: b?.services?.length ?? 0,
  };
}
export function buildWorkflowWizard(
  workflowId: WorkflowId,
  b: BusinessProfileCompletion,
  suggestions?: ReadonlyArray<WizardFieldSuggestion>,
): Wizard {
  const wf = WORKFLOWS[workflowId];
  const suggestionMap = toSuggestionMap(suggestions);
  return {
    proposalId: randomUUID(), workflowId, label: wf.label,
    steps: wf.steps.map((stepId) => {
      const step = STEPS[stepId];
      return {
        id: stepId,
        label: step.label,
        hint: step.hint,
        icon: step.icon as StepIconKey,
        done: step.done(b),
        fields: (step.fields as FieldId[][]).map((page) =>
          page.map((id) => {
            const [g, n] = id.split('.') as [keyof typeof FIELDS, string];
            const def = (FIELDS[g] as Record<string, FieldDef>)[n];
            return {
              id,
              label: def.label,
              required: def.required,
              helpText: def.helpText,
              suggestion: suggestionMap[id],
            };
          }),
        ),
      };
    }),
  };
}
export function buildCompletionCard(workflowId: WorkflowId, b: Business | null, appUrl: string): SummaryCard {
  const wf = WORKFLOWS[workflowId];
  return {
    kind: 'summary', 
    title: wf.completion.title, 
    detail: wf.completion.detail,
    shareUrl: wf.completion.shareUrl ? `${appUrl}/book/${b?.slug ?? ''}` : undefined,
  };
}
export { 
  selectActiveWorkflowId, 
  isWorkflowDone 
};