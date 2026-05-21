import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { ServicesService } from '../services.service';
import { toServiceListItem } from './serializers';
import { ServiceLookupArgsSchema, type ServiceLookupArgs } from './schemas';

@ToolHandler({
  name: 'service_get',
  description:
    'Fetch full details for one service by id (preferred) or name. ' +
    'Use to answer questions about a specific service. ',
})
@Injectable()
export class GetServiceTool extends BaseToolHandler<ServiceLookupArgs> {
  readonly schema = ServiceLookupArgsSchema;

  constructor(private readonly services: ServicesService) {
    super();
  }

  async execute(args: ServiceLookupArgs, ctx: ToolContext): Promise<ToolResult> {
    const service =
      args.id !== undefined
        ? await this.services.findByIdAndBusiness(args.id, ctx.businessId)
        : await this.services.findByNameAndBusiness(args.name!, ctx.businessId);

    if (!service) {
      return ToolResultHelpers.notFound(
        'Service',
        args.id !== undefined ? `ID ${args.id}` : `"${args.name}"`,
      );
    }

    const item = toServiceListItem(service);
    const priceLabel =
      item.priceType === 'FREE'
        ? 'free'
        : item.priceType === 'ON_REQUEST'
          ? 'on request'
          : `$${item.price}`;

    return ToolResultHelpers.withData(
      `${item.name} — ${priceLabel}, ${item.durationMinutes} min`,
      { service: item },
    );
  }
}
