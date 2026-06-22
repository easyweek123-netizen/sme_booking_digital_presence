import { isStepDone, type StepId, type SetupState } from './steps';

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
      detail: "Dummy detail to change later" 
    },
  },
};

export type WorkflowId = keyof typeof WORKFLOWS;
export const WORKFLOW_IDS = Object.keys(WORKFLOWS) as [WorkflowId, ...WorkflowId[]];
export const isWorkflowId = (s: string): s is WorkflowId => s in WORKFLOWS;
export const isWorkflowDone = (id: WorkflowId, s: SetupState): boolean =>
  WORKFLOWS[id].steps.every((step) => isStepDone(step, s));
export function selectActiveWorkflowId(s: SetupState): WorkflowId | null {
  return (WORKFLOW_IDS as WorkflowId[])
    .sort((a, b) => WORKFLOWS[a].order - WORKFLOWS[b].order)
    .find((id) => !isWorkflowDone(id, s)) ?? null;
}