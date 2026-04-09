import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  BusinessUpdateArgsSchema,
  createProposal,
  ToolResultHelpers,
  type BusinessUpdateArgs,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { BusinessService } from '../business.service';

@ToolHandler({
  name: 'business_update',
  description:
    'Update the business profile. Accepts any combination of: name, description, phone, address, city, website, instagram, logoUrl, brandColor, coverImageUrl, aboutContent. ' +
    'For aboutContent: generate rich HTML content for the public booking page About section -- use headings, paragraphs, lists, and blockquotes to create a compelling business story. At least one field is required.',
})
@Injectable()
export class UpdateBusinessTool extends BaseToolHandler<BusinessUpdateArgs> {
  readonly schema = BusinessUpdateArgsSchema;

  constructor(private readonly businessService: BusinessService) {
    super();
  }

  async execute(args: BusinessUpdateArgs, ctx: ToolContext): Promise<ToolResult> {
    const business = await this.businessService.findByOwnerId(ctx.ownerId);

    if (!business) {
      return ToolResultHelpers.error(
        'No business found. The user needs to complete onboarding first.',
      );
    }

    // Destructure to exclude non-updateable fields; rest = full current profile
    const {
      id, ownerId, slug, createdAt, updatedAt,
      owner, services, bookings, businessType, businessTypeId, workingHours,
      ...currentProfile
    } = business;

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined) updates[key] = value;
    }

    const proposal = createProposal('business:update', {
      businessId: business.id,
      updates,
      current: currentProfile,
    });

    const changes = Object.entries(updates).map(([key, value]) => {
      const old = currentProfile[key as keyof typeof currentProfile];
      return old === null || old === '' || old === undefined
        ? `${key}: (added)`
        : `${key}: updated`;
    });

    return ToolResultHelpers.withProposal(
      proposal,
      `I've prepared updates for your business profile: ${changes.join(', ')}. Please review and confirm.`,
    );
  }
}
