import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, WORKFLOW_IDS, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { BusinessService } from '../../business/business.service';
import { buildCompletionCard } from './workflow-helper';

const Args = z.object({ workflow_id: z.enum(WORKFLOW_IDS) });

@ToolHandler({ name: 'show_workflow_summary', description:
  'Emit the completion summary card (with the share link) when a workflow is fully finished. Call ' +
  'once, right after the owner saves the last remaining step and the setup status shows every step ' +
  'done. Do not call it before the workflow is complete.' })
@Injectable()
export class ShowWorkflowSummaryTool extends BaseToolHandler<z.infer<typeof Args>> {
  readonly schema = Args;
  constructor(private readonly business: BusinessService, private readonly config: ConfigService) { super(); }
  async execute(args: z.infer<typeof Args>, ctx: ToolContext): Promise<ToolResult> {
    const b = await this.business.findByOwnerId(ctx.ownerId);
    const appUrl = this.config.get<string>('FRONTEND_APP_URL', 'https://');
    return ToolResultHelpers.withCards(
      [buildCompletionCard(args.workflow_id, b, appUrl)], 'Showing the completion card.');
  }
}