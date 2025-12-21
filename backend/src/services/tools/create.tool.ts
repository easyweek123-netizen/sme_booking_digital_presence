import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  ServiceInputSchema,
  createProposal,
  ToolResultHelpers,
  type ServiceInput,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';

/**
 * Tool handler for creating a new service.
 * Uses ServiceInputSchema from shared package as single source of truth.
 * Creates a proposal for frontend confirmation.
 */
@ToolHandler({
  name: 'services_create',
  description:
    'Create a new service for the business. Requires name, price, and duration.',
})
@Injectable()
export class CreateServiceTool extends BaseToolHandler<ServiceInput> {
  readonly schema = ServiceInputSchema;

  async execute(args: ServiceInput, ctx: ToolContext): Promise<ToolResult> {
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
