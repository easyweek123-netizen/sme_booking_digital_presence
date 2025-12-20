import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { createProposal, ToolResultHelpers } from '@bookeasy/shared';
import type { ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';

/**
 * Schema for services_create tool arguments.
 * Descriptions are used by AI to understand each parameter.
 */
const CreateServiceArgsSchema = z.object({
  name: z
    .string()
    .min(1, 'Service name is required')
    .describe('Service name (e.g., "Haircut", "60-min Massage")'),
  price: z
    .number()
    .nonnegative('Price must be non-negative')
    .describe('Price in dollars (e.g., 50)'),
  durationMinutes: z
    .number()
    .int()
    .positive('Duration must be a positive integer')
    .describe('Duration in minutes (e.g., 30, 60, 90)'),
  description: z
    .string()
    .optional()
    .describe('Optional description of the service'),
  imageUrl: z
    .string()
    .optional()
    .describe('Optional image URL for the service'),
});

type CreateServiceArgs = z.infer<typeof CreateServiceArgsSchema>;

/**
 * Tool handler for creating a new service.
 * Creates a proposal for frontend confirmation.
 */
@ToolHandler({
  name: 'services_create',
  description: 'Create a new service for the business. Requires name, price, and duration.',
})
@Injectable()
export class CreateServiceTool extends BaseToolHandler<CreateServiceArgs> {
  readonly schema = CreateServiceArgsSchema;

  async execute(args: CreateServiceArgs, ctx: ToolContext): Promise<ToolResult> {
    const { name, price, durationMinutes, description, imageUrl } = args;

    const proposal = createProposal('service:create', {
      businessId: ctx.businessId,
      service: { name, price, durationMinutes, description, imageUrl },
    });

    return ToolResultHelpers.withProposal(
      proposal,
      `I've prepared a new service "${name}" for $${price} (${durationMinutes} min). Please review and confirm.`,
    );
  }
}

