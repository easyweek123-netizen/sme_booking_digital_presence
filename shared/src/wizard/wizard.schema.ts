import { z } from 'zod';
import { GROUP, type Group } from './constants';
import { groupOf, type FieldId } from './fields';

export const StepIconSchema = z.enum(['sparkle', 'map_pin', 'scissors']);

export const WizardFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  helpText: z.string().optional(),
  required: z.boolean().optional(),
  suggestion: z.string().optional(),
});
export const WizardStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  hint: z.string(),
  icon: StepIconSchema.optional(),
  done: z.boolean(),
  fields: z.array(z.array(WizardFieldSchema)),  // pages: each inner array is one page
});
export const WizardSchema = z.object({
  proposalId: z.string().uuid(),
  workflowId: z.string(),
  label: z.string(),
  hint: z.string().optional(),
  steps: z.array(WizardStepSchema),
});
export type Wizard = z.infer<typeof WizardSchema>;
export type WizardStep = z.infer<typeof WizardStepSchema>;
export type WizardField = z.infer<typeof WizardFieldSchema>;

export function stepGroup(step: WizardStep): Group {
  const id = step.fields[0]?.[0]?.id as FieldId | undefined;
  return id ? groupOf(id) : GROUP.WEBSITE;
}