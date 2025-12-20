import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { createProposal, ToolResultHelpers } from '@bookeasy/shared';
import type { ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { ServicesService } from '../services.service';

/**
 * Schema for services_update tool arguments.
 * Supports both ID (preferred) and name (fallback) lookup.
 */
const UpdateServiceArgsSchema = z
  .object({
    id: z
      .number()
      .optional()
      .describe('Service ID (preferred - get from services_list)'),
    name: z
      .string()
      .optional()
      .describe('Service name (fallback if ID not available)'),
    newName: z
      .string()
      .min(1)
      .optional()
      .describe('New name for the service'),
    price: z
      .number()
      .nonnegative()
      .optional()
      .describe('New price in dollars'),
    durationMinutes: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('New duration in minutes'),
    description: z
      .string()
      .optional()
      .describe('New description'),
    imageUrl: z
      .string()
      .optional()
      .describe('New image URL for the service'),
  })
  .refine((data) => data.id !== undefined || data.name !== undefined, {
    message: 'Either id or name is required',
  });

type UpdateServiceArgs = z.infer<typeof UpdateServiceArgsSchema>;

/**
 * Tool handler for updating a service.
 * Resolves service by ID (preferred) or name, creates update proposal.
 */
@ToolHandler({
  name: 'services_update',
  description: 'Update an existing service. Use the service ID from services_list, or the service name.',
})
@Injectable()
export class UpdateServiceTool extends BaseToolHandler<UpdateServiceArgs> {
  readonly schema = UpdateServiceArgsSchema;

  constructor(private readonly servicesService: ServicesService) {
    super();
  }

  async execute(args: UpdateServiceArgs, ctx: ToolContext): Promise<ToolResult> {
    const { id, name, newName, price, durationMinutes, description, imageUrl } = args;

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

    // Merge existing values with updates
    const updatedService = {
      name: newName ?? service.name,
      price: price ?? Number(service.price),
      durationMinutes: durationMinutes ?? service.durationMinutes,
      description: description ?? service.description ?? undefined,
      imageUrl: imageUrl ?? service.imageUrl ?? undefined,
    };

    const proposal = createProposal('service:update', {
      resolvedId: service.id,
      serviceName: service.name,
      service: updatedService,
    });

    // Build change summary
    const changes: string[] = [];
    if (newName && newName !== service.name) changes.push(`name → "${newName}"`);
    if (price !== undefined && price !== Number(service.price)) changes.push(`price → $${price}`);
    if (durationMinutes !== undefined && durationMinutes !== service.durationMinutes) {
      changes.push(`duration → ${durationMinutes} min`);
    }
    if (description !== undefined && description !== service.description) {
      changes.push('description updated');
    }
    if (imageUrl !== undefined && imageUrl !== service.imageUrl) {
      changes.push('image updated');
    }

    const changesSummary = changes.length > 0 ? changes.join(', ') : 'no changes detected';

    return ToolResultHelpers.withProposal(
      proposal,
      `I've prepared updates for "${service.name}": ${changesSummary}. Please review and confirm.`,
    );
  }
}

