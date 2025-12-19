import { Injectable } from '@nestjs/common';
import { ToolHandler, ToolResult, ToolDefinition, ToolContext } from '../../common';
import { ServicesService } from '../services.service';

/**
 * Handler for services_list tool
 * Returns all services for the business
 */
@Injectable()
export class ListServicesHandler implements ToolHandler {
  readonly toolName = 'services_list';

  constructor(private readonly servicesService: ServicesService) {}

  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: this.toolName,
        description: 'Get all services for the business. Returns a list with names, prices, and durations.',
        parameters: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    };
  }

  async handle(
    _args: Record<string, unknown>,
    context: ToolContext,
  ): Promise<ToolResult> {
    const services = await this.servicesService.findByBusiness(context.businessId);
    
    const serviceList = services
      .map((s) => `${s.name} ($${s.price}, ${s.durationMinutes} min)`)
      .join(', ');

    return {
      success: true,
      message: services.length > 0
        ? `You have ${services.length} service(s): ${serviceList}`
        : "You don't have any services yet. Would you like to create one?",
      data: {
        services: services.map((s) => ({
          id: s.id,
          name: s.name,
          price: Number(s.price),
          durationMinutes: s.durationMinutes,
          description: s.description,
          category: s.category ? { id: s.category.id, name: s.category.name } : null,
        })),
      },
      previewContext: 'services',
    };
  }
}

