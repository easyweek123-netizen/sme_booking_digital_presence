import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, WORKFLOW_IDS, isWorkflowId, type ToolResult, type WorkflowId } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { BusinessService } from '../../business/business.service';
import { toSetupState, buildWorkflowWizard, selectActiveWorkflowId } from './workflow-helper';

const Args = z.object({ 
  workflow_id: z.enum(WORKFLOW_IDS).optional() 
});

@ToolHandler({ name: 'open_workflow', description:
  "Pin the full setup workflow (checklist + every step's fields) above the chat input. Omit " +
  'workflow_id for the active workflow. Call on first chat open when setup is incomplete, or when ' +
  'the owner asks to start/resume. The frontend handles step navigation and ticking — do NOT re-call after a save.' })
@Injectable()
export class OpenWorkflowTool extends BaseToolHandler<z.infer<typeof Args>> {
  readonly schema = Args;
  constructor(private readonly business: BusinessService) { super(); }
  async execute(args: z.infer<typeof Args>, ctx: ToolContext): Promise<ToolResult> {
    const b = await this.business.findByOwnerId(ctx.ownerId);
    const state = toSetupState(b);
    const id: WorkflowId | null =
      args.workflow_id && isWorkflowId(args.workflow_id) ? args.workflow_id : selectActiveWorkflowId(state);
    
    if (!id) return ToolResultHelpers.success('All setup workflows are complete.');
    
    return ToolResultHelpers.withWizard(
      buildWorkflowWizard(id, state), 
      'Showing the setup workflow.'
    );
  }
}