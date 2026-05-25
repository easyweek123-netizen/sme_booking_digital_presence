import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler, buildProposalToolMessage } from '../../common/tools';
import { createProposal, ToolResultHelpers, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { ServiceToolSeedSchema, type ServiceToolSeed } from './schemas';

@ToolHandler({
  name: 'service_create',
  description:
    'Open the new-service form pre-filled with values the user has described or you are proposing' +
    'Pass only what the user actually said (name, type, durationMinutes, price, priceType, description, categoryId, capacity). ' +
    'The user completes all fields in form, you can suggest values in form fields. ' +
    'Call once per service; for multiple services make parallel calls.',
})
@Injectable()
export class CreateServiceTool extends BaseToolHandler<ServiceToolSeed> {
  readonly schema = ServiceToolSeedSchema;

  async execute(suggestedEdits: ServiceToolSeed, ctx: ToolContext): Promise<ToolResult> {
    const proposal = createProposal('service:create', {
      businessId: ctx.businessId,
      suggestedEdits,
    });

    const label = suggestedEdits.name ? `"${suggestedEdits.name}"` : 'a new service';
    return ToolResultHelpers.withProposal(
      proposal,
      buildProposalToolMessage(`opened new-service form for ${label}`, [proposal]),
    );
  }
}
