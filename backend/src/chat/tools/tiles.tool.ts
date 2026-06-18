import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, ONBOARDING_PRESETS, type ToolResult, type TilesCard } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { BusinessService } from '../../business/business.service';
import { computeFlowProgress, FLOW_META } from './onboarding-flows';

const ShowTilesArgsSchema = z.object({
  kind: z.enum(['setup_flows', 'service_templates', 'location_templates']),
});
type ShowTilesArgs = z.infer<typeof ShowTilesArgsSchema>;

@ToolHandler({
  name: 'show_tiles',
  description:
    'Render an inline card of tappable choices. kind="setup_flows" shows the three setup flows; ' +
    'tapping a tile sends a user message that you respond to by calling open_wizard with that preset.',
})
@Injectable()
export class ShowTilesTool extends BaseToolHandler<ShowTilesArgs> {
  readonly schema = ShowTilesArgsSchema;
  constructor(private readonly businessService: BusinessService) { super(); }

  async execute(args: ShowTilesArgs, ctx: ToolContext): Promise<ToolResult> {
    if (args.kind !== 'setup_flows') {
      return ToolResultHelpers.error(`tiles kind "${args.kind}" is not implemented yet.`);
    }
    const business = await this.businessService.findByOwnerId(ctx.ownerId);
    const done = computeFlowProgress(business);
    const card: TilesCard = {
      kind: 'tiles',
      items: ONBOARDING_PRESETS.map((preset) => {
        const meta = FLOW_META[preset];
        return {
          id: preset,
          label: meta.label,
          subtitle: meta.hint,
          icon: preset,                                // FE maps id → icon
          message: done[preset] ? `Edit ${meta.label.toLowerCase()}` : `Set up ${meta.label.toLowerCase()}`,
        };
      }),
    };
    return ToolResultHelpers.withCards(card, 'Rendered setup tiles.');
  }
}