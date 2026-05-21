import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { ServicesService } from '../services.service';
import { toServiceListItem } from './serializers';

const ListServicesArgsSchema = z.object({});
type ListServicesArgs = z.infer<typeof ListServicesArgsSchema>;

@ToolHandler({
  name: 'service_list',
  description:
    'List all services for the business with id, name, type, price, duration, location, and isActive. ' +
    'Call before services_update or services_delete to obtain the service ID.',
})
@Injectable()
export class ListServicesTool extends BaseToolHandler<ListServicesArgs> {
  readonly schema = ListServicesArgsSchema;

  constructor(private readonly services: ServicesService) {
    super();
  }

  async execute(_args: ListServicesArgs, ctx: ToolContext): Promise<ToolResult> {
    const all = await this.services.findByBusiness(ctx.businessId);

    if (all.length === 0) {
      return ToolResultHelpers.success(
        "You don't have any services yet. Would you like to create one?",
      );
    }

    const items = all.map(toServiceListItem);
    const summary = items.map((s) => `${s.name} (${s.durationMinutes} min)`).join(', ');

    return ToolResultHelpers.withData(
      `You have ${items.length} service(s): ${summary}`,
      { services: items },
      'services',
    );
  }
}
