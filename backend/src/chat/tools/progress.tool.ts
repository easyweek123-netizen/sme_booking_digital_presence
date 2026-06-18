import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, type ToolResult, type ProgressCard } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { BusinessService } from '../../business/business.service';
import { buildProgressFlows } from './onboarding-flows';

const ShowProgressArgsSchema = z.object({});
type ShowProgressArgs = z.infer<typeof ShowProgressArgsSchema>;

@ToolHandler({
  name: 'show_progress',
  description:
    'Render the inline setup-progress card (Branding / Business spot / First service with done state). ' +
    'Call on first chat open when setup is incomplete, and after each setup step is saved or skipped.',
})
@Injectable()
export class ShowProgressTool extends BaseToolHandler<ShowProgressArgs> {
  readonly schema = ShowProgressArgsSchema;
  constructor(private readonly businessService: BusinessService) { super(); }

  async execute(_args: ShowProgressArgs, ctx: ToolContext): Promise<ToolResult> {
    const business = await this.businessService.findByOwnerId(ctx.ownerId);
    const card: ProgressCard = { kind: 'progress', flows: buildProgressFlows(business) };
    return ToolResultHelpers.withCards(card, 'Rendered setup progress.');
  }
}