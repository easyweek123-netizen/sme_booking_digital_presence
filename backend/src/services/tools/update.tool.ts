import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler, buildProposalToolMessage } from '../../common/tools';
import { createProposal, ToolResultHelpers, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { ServicesService } from '../services.service';
import { ServiceUpdateArgsSchema, type ServiceUpdateArgs } from './schemas';

@ToolHandler({
  name: 'services_update',
  description:
    'Open the edit-service form for an existing service, pre-filled with the changes the user wants or you are suggesting ' +
    'Lookup by id (preferred, from service_list) or name. Only include fields the user explicitly changed.',
})
@Injectable()
export class UpdateServiceTool extends BaseToolHandler<ServiceUpdateArgs> {
  readonly schema = ServiceUpdateArgsSchema;

  constructor(private readonly services: ServicesService) {
    super();
  }

  async execute(args: ServiceUpdateArgs, ctx: ToolContext): Promise<ToolResult> {
    const { id, name, ...suggestedEdits } = args;

    const service =
      id !== undefined
        ? await this.services.findByIdAndBusiness(id, ctx.businessId)
        : await this.services.findByNameAndBusiness(name!, ctx.businessId);

    if (!service) {
      return ToolResultHelpers.notFound(
        'Service',
        id !== undefined ? `ID ${id}` : `"${name}"`,
      );
    }

    const proposal = createProposal('service:update', {
      resolvedId: service.id,
      serviceName: service.name,
      suggestedEdits,
    });

    const changed = Object.keys(suggestedEdits).filter(
      (k) => suggestedEdits[k as keyof typeof suggestedEdits] !== undefined,
    );
    const summary = changed.length ? `editing ${changed.join(', ')}` : 'no changes proposed';

    return ToolResultHelpers.withProposal(
      proposal,
      buildProposalToolMessage(`edit "${service.name}" — ${summary}`, [proposal]),
    );
  }
}
