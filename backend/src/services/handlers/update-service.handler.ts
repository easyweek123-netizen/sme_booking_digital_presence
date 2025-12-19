import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { ToolHandler, ToolResult, ToolDefinition, ToolContext } from '../../common';
import { ServicesService } from '../services.service';
import type { ServiceUpdateAction } from '@bookeasy/shared';

/**
 * Schema for services_update tool arguments
 */
const UpdateServiceArgsSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  newName: z.string().min(1).optional(),
  price: z.number().nonnegative('Price must be non-negative').optional(),
  durationMinutes: z.number().int().positive('Duration must be a positive integer').optional(),
  description: z.string().optional(),
});

type UpdateServiceArgs = z.infer<typeof UpdateServiceArgsSchema>;

/**
 * Handler for services_update tool
 * Resolves service by name and creates an update proposal
 */
@Injectable()
export class UpdateServiceHandler implements ToolHandler {
  readonly toolName = 'services_update';

  constructor(private readonly servicesService: ServicesService) {}

  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: this.toolName,
        description: 'Update an existing service by name. Pass the service name and the fields to update.',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Current name of the service to update',
            },
            newName: {
              type: 'string',
              description: 'New name for the service (optional)',
            },
            price: {
              type: 'number',
              description: 'New price in dollars (optional)',
            },
            durationMinutes: {
              type: 'number',
              description: 'New duration in minutes (optional)',
            },
            description: {
              type: 'string',
              description: 'New description (optional)',
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
    const parsed = UpdateServiceArgsSchema.safeParse(args);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Invalid arguments',
      };
    }

    const { name, newName, price, durationMinutes, description } = parsed.data;

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

    // Build updated service data (merge existing with new values)
    const updatedName = newName ?? service.name;
    const updatedPrice = price ?? Number(service.price);
    const updatedDuration = durationMinutes ?? service.durationMinutes;
    const updatedDescription = description ?? service.description ?? undefined;

    const proposal: ServiceUpdateAction = {
      type: 'service:update',
      proposalId: randomUUID(),
      executionMode: 'confirm',
      resolvedId: service.id,
      serviceName: name,
      service: {
        name: updatedName,
        price: updatedPrice,
        durationMinutes: updatedDuration,
        description: updatedDescription,
      },
    };

    // Build change summary for AI message
    const changes: string[] = [];
    if (newName && newName !== service.name) changes.push(`name → "${newName}"`);
    if (price !== undefined && price !== Number(service.price)) changes.push(`price → $${price}`);
    if (durationMinutes !== undefined && durationMinutes !== service.durationMinutes) {
      changes.push(`duration → ${durationMinutes} min`);
    }
    if (description !== undefined && description !== service.description) {
      changes.push('description updated');
    }

    const changesSummary = changes.length > 0 
      ? changes.join(', ') 
      : 'no changes detected';

    return {
      success: true,
      message: `I've prepared updates for "${service.name}": ${changesSummary}. Please review and confirm.`,
      proposals: [proposal],
    };
  }
}

