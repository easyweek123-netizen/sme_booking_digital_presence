import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { createProposal, ToolResultHelpers } from '@bookeasy/shared';
import type { ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { ServicesService } from '../services.service';

/**
 * Schema for services_delete tool arguments.
 * Supports both ID (preferred) and name (fallback) lookup.
 */
const DeleteServiceArgsSchema = z
  .object({
    id: z
      .number()
      .optional()
      .describe('Service ID (preferred - get from services_list)'),
    name: z
      .string()
      .optional()
      .describe('Service name (fallback if ID not available)'),
  })
  .refine((data) => data.id !== undefined || data.name !== undefined, {
    message: 'Either id or name is required',
  });

type DeleteServiceArgs = z.infer<typeof DeleteServiceArgsSchema>;

/**
 * Tool handler for deleting a service.
 * Resolves service by ID (preferred) or name, creates delete proposal.
 */
@ToolHandler({
  name: 'services_delete',
  description: 'Delete a service. Use the service ID from services_list, or the service name. Requires confirmation.',
})
@Injectable()
export class DeleteServiceTool extends BaseToolHandler<DeleteServiceArgs> {
  readonly schema = DeleteServiceArgsSchema;

  constructor(private readonly servicesService: ServicesService) {
    super();
  }

  async execute(args: DeleteServiceArgs, ctx: ToolContext): Promise<ToolResult> {
    const { id, name } = args;

    // Resolve service: prefer ID, fallback to name
    let service;
    if (id !== undefined) {
      service = await this.servicesService.findByIdAndBusiness(id, ctx.businessId);
    } else if (name) {
      service = await this.servicesService.findByNameAndBusiness(name, ctx.businessId);
    }

    if (!service) {
      const identifier = id !== undefined ? `ID ${id}` : `"${name}"`;
      return ToolResultHelpers.notFound('Service', identifier);
    }

    const proposal = createProposal('service:delete', {
      resolvedId: service.id,
      name: service.name,
    });

    return ToolResultHelpers.withProposal(
      proposal,
      `Are you sure you want to delete "${service.name}"? This cannot be undone.`,
    );
  }
}

