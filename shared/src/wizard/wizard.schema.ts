import { z } from 'zod';

export const WizardFieldSchema = z.object({
  id: z.string(), 
  label: z.string(), 
  helpText: z.string().optional(), 
  required: z.boolean().optional(),
});
export const WizardStepSchema = z.object({
  id: z.string(), 
  label: z.string(), 
  hint: z.string(), 
  done: z.boolean(),
  fields: z.array(WizardFieldSchema),
});
export const WizardSchema = z.object({
  proposalId: z.string().uuid(),
  workflowId: z.string(),
  label: z.string(),
  steps: z.array(WizardStepSchema),
});
export type Wizard = z.infer<typeof WizardSchema>;
export type WizardStep = z.infer<typeof WizardStepSchema>;
export type WizardField = z.infer<typeof WizardFieldSchema>;