import { isStepDone, type StepId, type BusinessProfileCompletion } from './steps';

export interface WorkflowDef {
  label: string; 
  order: number;
  steps: StepId[];
  completion: { 
    title: string; 
    detail?: string; 
    shareUrl?: boolean 
  };
}
export const WORKFLOWS = {
  setup_web_page: {
    label: 'Set up your booking page', order: 1,
    steps: ['branding', 'business_spot', 'service'] as StepId[],
    completion: { 
      title: 'Your booking page is ready to share', 
      shareUrl: true, 
      detail: "Great work. Your core setup is complete. Share your booking link now, and refine services, hours, and profile details anytime." 
    },
  },
};

export type WorkflowId = keyof typeof WORKFLOWS;
export const WORKFLOW_IDS = Object.keys(WORKFLOWS) as [WorkflowId, ...WorkflowId[]];
export const isWorkflowId = (s: string): s is WorkflowId => s in WORKFLOWS;
export const isWorkflowDone = (id: WorkflowId, b: BusinessProfileCompletion): boolean =>
  WORKFLOWS[id].steps.every((step) => isStepDone(step, b));
export function selectActiveWorkflowId(b: BusinessProfileCompletion): WorkflowId | null {
  return (WORKFLOW_IDS as WorkflowId[])
    .sort((a, c) => WORKFLOWS[a].order - WORKFLOWS[c].order)
    .find((id) => !isWorkflowDone(id, b)) ?? null;
}