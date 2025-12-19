import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { ToolHandler, ToolResult, ToolDefinition, ToolContext } from '../../common';
import type { ServiceCreateAction } from '@bookeasy/shared';

/**
 * Schema for services_create tool arguments
 */
const CreateServiceArgsSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  price: z.number().nonnegative('Price must be non-negative'),
  durationMinutes: z.number().int().positive('Duration must be a positive integer'),
  description: z.string().optional(),
});

type CreateServiceArgs = z.infer<typeof CreateServiceArgsSchema>;

/**
 * Handler for services_create tool
 * Creates a proposal for a new service
 */
@Injectable()
export class CreateServiceHandler implements ToolHandler {
  readonly toolName = 'services_create';

  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: this.toolName,
        description: 'Create a new service for the business. Requires name, price, and duration.',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Service name (e.g., "Haircut", "60-min Massage")',
            },
            price: {
              type: 'number',
              description: 'Price in dollars (e.g., 50)',
            },
            durationMinutes: {
              type: 'number',
              description: 'Duration in minutes (e.g., 30, 60, 90)',
            },
            description: {
              type: 'string',
              description: 'Optional description of the service',
            },
          },
          required: ['name', 'price', 'durationMinutes'],
        },
      },
    };
  }

  async handle(
    args: Record<string, unknown>,
    context: ToolContext,
  ): Promise<ToolResult> {
    // Validate and parse arguments
    const parsed = CreateServiceArgsSchema.safeParse(args);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Invalid arguments',
      };
    }

    const { name, price, durationMinutes, description } = parsed.data;

    const proposal: ServiceCreateAction = {
      type: 'service:create',
      proposalId: randomUUID(),
      executionMode: 'confirm',
      businessId: context.businessId,
      service: {
        name,
        price,
        durationMinutes,
        description,
      },
    };

    return {
      success: true,
      message: `I've prepared a new service "${name}" for $${price} (${durationMinutes} min). Please review and confirm.`,
      proposals: [proposal],
    };
  }
}

