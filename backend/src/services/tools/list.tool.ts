import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers } from '@bookeasy/shared';
import type { ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { ServicesService } from '../services.service';

/**
 * Schema for services_list tool arguments (no args needed)
 */
const ListServicesArgsSchema = z.object({});

type ListServicesArgs = z.infer<typeof ListServicesArgsSchema>;

/**
 * Tool handler for listing all services.
 * Returns service data with IDs for AI context.
 */
@ToolHandler({
  name: 'services_list',
  description: 'Get all services for the business. Returns a list with names, prices, durations, and IDs.',
})
@Injectable()
export class ListServicesTool extends BaseToolHandler<ListServicesArgs> {
  readonly schema = ListServicesArgsSchema;

  constructor(private readonly servicesService: ServicesService) {
    super();
  }

  async execute(_args: ListServicesArgs, ctx: ToolContext): Promise<ToolResult> {
    const services = await this.servicesService.findByBusiness(ctx.businessId);

    if (services.length === 0) {
      return ToolResultHelpers.success(
        "You don't have any services yet. Would you like to create one?",
      );
    }

    // Format for human-readable message
    const serviceList = services
      .map((s) => `${s.name} ($${s.price}, ${s.durationMinutes} min)`)
      .join(', ');

    // Include IDs in data for AI to use in subsequent operations
    const serviceData = services.map((s) => ({
      id: s.id,
      name: s.name,
      price: Number(s.price),
      durationMinutes: s.durationMinutes,
      description: s.description,
    }));

    return ToolResultHelpers.withData(
      `You have ${services.length} service(s): ${serviceList}`,
      { services: serviceData },
      'services',
    );
  }
}

