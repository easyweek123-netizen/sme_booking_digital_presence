import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { ToolHandler, ToolResult, ToolDefinition, ToolContext } from '../../common';
import { ServicesService } from '../services.service';
import type { ServiceDeleteAction } from '@bookeasy/shared';

/**
 * Schema for services_delete tool arguments
 */
const DeleteServiceArgsSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
});

type DeleteServiceArgs = z.infer<typeof DeleteServiceArgsSchema>;

/**
 * Handler for services_delete tool
 * Resolves service by name and creates a delete proposal
 */
@Injectable()
export class DeleteServiceHandler implements ToolHandler {
  readonly toolName = 'services_delete';

  constructor(private readonly servicesService: ServicesService) {}

  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: this.toolName,
        description: 'Delete a service by name. This action requires confirmation.',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the service to delete',
            },
          },
          required: ['name'],
        },
      },
    };
  }

  async handle(
    args: Record<string, unknown>,
    context: ToolContext,
  ): Promise<ToolResult> {
    // Validate and parse arguments
    const parsed = DeleteServiceArgsSchema.safeParse(args);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Invalid arguments',
      };
    }

    const { name } = parsed.data;

    // Resolve service by name
    const service = await this.servicesService.findByNameAndBusiness(
      name,
      context.businessId,
    );

    if (!service) {
      return {
        success: false,
        error: `Service "${name}" not found. Use services_list to see available services.`,
      };
    }

    const proposal: ServiceDeleteAction = {
      type: 'service:delete',
      proposalId: randomUUID(),
      executionMode: 'confirm',
      resolvedId: service.id,
      name: service.name,
    };

    return {
      success: true,
      message: `Are you sure you want to delete "${service.name}"? This cannot be undone.`,
      proposals: [proposal],
    };
  }
}

