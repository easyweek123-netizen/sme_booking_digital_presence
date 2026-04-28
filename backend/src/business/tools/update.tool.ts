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
import { buildProposalToolMessage } from '../../common/tools';

@ToolHandler({
  name: 'business_update',
  description:
    'Propose updates for business profile. Call this tool to show an editable form and propose prefilled data as default values.' +
    'User confirm, cancel or ask followup questions about proposal. ' +
    'On updates: only send fields being changed — existing values are pre-filled automatically. ' +
    'Fields: name, description (short plain-text tagline for the hero, not HTML), phone, address, city, website, instagram, logoUrl, brandColor, coverImageUrl, workingHours (all 7 days with sensible defaults for the business type), aboutContent (long About section: HTML only <h2>, <p>, <ul>, <blockquote>;. ' +
    'Prefer batching related fields (e.g. phone + address + city, or all branding fields together). At least one field is required.',
})
@Injectable()
export class UpdateBusinessTool extends BaseToolHandler<BusinessUpdateArgs> {
  readonly schema = BusinessUpdateArgsSchema;

  constructor(private readonly businessService: BusinessService) {
    super();
  }

  async execute(
    args: BusinessUpdateArgs,
    ctx: ToolContext,
  ): Promise<ToolResult> {
    const business = await this.businessService.findByOwnerId(ctx.ownerId);

    if (!business) {
      return ToolResultHelpers.error(
        'No business found. The user needs to complete onboarding first.',
      );
    }

    const {
      id,
      ownerId,
      slug,
      createdAt,
      updatedAt,
      owner,
      services,
      bookings,
      businessType,
      businessTypeId,
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
        ? `${key}: (proposed new value)`
        : `${key}: (updated to change)`;
    });

    return ToolResultHelpers.withProposal(
      proposal,
      buildProposalToolMessage(
        `business profile update — fields: ${changes.join(', ')}`,
        [proposal],
      ),
    );
  }
}
