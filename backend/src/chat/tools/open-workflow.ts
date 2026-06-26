import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { BusinessProfileCompletion, ToolResultHelpers, WORKFLOWS, WORKFLOW_IDS, WizardFieldSuggestionSchema, isWorkflowId, type ToolResult, type WorkflowId } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { BusinessService } from '../../business/business.service';
import { buildWorkflowWizard, selectActiveWorkflowId } from './workflow-helper';

const OpenWorkflowArgs = z.object({
  workflow_id: z.enum(WORKFLOW_IDS).optional(),
  suggestions: z.array(WizardFieldSuggestionSchema).optional(),
});

@ToolHandler({ name: 'open_workflow', description:
  "Pin the full setup workflow (checklist + every step's fields) above the chat input. Omit " +
  'workflow_id for the active workflow. Call on first chat open when setup is incomplete, or when ' +
  'the owner asks to start/resume. Pass `suggestions` (array of { field, value }) to pre-propose values ' +
  'for these fields based on the business name/type: website.tagline, website.about, service.name, ' +
  'service.description, service.category, service.price — each is shown as a one-tap chip under its input. ' +
  'The frontend handles step navigation and ticking — do NOT re-call after a save.' })
@Injectable()
export class OpenWorkflowTool extends BaseToolHandler<z.infer<typeof OpenWorkflowArgs>> {
  readonly schema = OpenWorkflowArgs;
  constructor(private readonly business: BusinessService) { super(); }
  async execute(args: z.infer<typeof OpenWorkflowArgs>, ctx: ToolContext): Promise<ToolResult> {
    const b = await this.business.findByOwnerId(ctx.ownerId);
    const id: WorkflowId =
    args.workflow_id && isWorkflowId(args.workflow_id)
      ? args.workflow_id
      : (
          selectActiveWorkflowId(b as BusinessProfileCompletion) ??
          WORKFLOW_IDS
            .slice()
            .sort((a, c) => WORKFLOWS[a].order - WORKFLOWS[c].order)[0]
        );
    
    return ToolResultHelpers.withWizard(
      buildWorkflowWizard(id, b as BusinessProfileCompletion, args.suggestions ?? []),
      'Showing the setup workflow.'
    );
  }
}