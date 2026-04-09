import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { BusinessService } from '../business.service';

const GetBusinessArgsSchema = z.object({});
type GetBusinessArgs = z.infer<typeof GetBusinessArgsSchema>;

@ToolHandler({
  name: 'business_get',
  description:
    'Get the business profile including name, description, contact info, branding, and about content. Use this to check what is set up and what is missing.',
})
@Injectable()
export class GetBusinessTool extends BaseToolHandler<GetBusinessArgs> {
  readonly schema = GetBusinessArgsSchema;

  constructor(private readonly businessService: BusinessService) {
    super();
  }

  async execute(_args: GetBusinessArgs, ctx: ToolContext): Promise<ToolResult> {
    const business = await this.businessService.findByOwnerId(ctx.ownerId);

    if (!business) {
      return ToolResultHelpers.error(
        'No business found. The user needs to complete onboarding first.',
      );
    }

    const profile = {
      id: business.id,
      name: business.name,
      description: business.description,
      phone: business.phone,
      address: business.address,
      city: business.city,
      website: business.website,
      instagram: business.instagram,
      logoUrl: business.logoUrl,
      brandColor: business.brandColor,
      coverImageUrl: business.coverImageUrl,
      aboutContent: business.aboutContent,
      slug: business.slug,
      businessType: business.businessType?.name ?? null,
    };

    const missing = Object.entries(profile)
      .filter(([key, val]) => val === null && key !== 'businessType')
      .map(([key]) => key);

    const summary = missing.length > 0
      ? `Business "${business.name}" — missing fields: ${missing.join(', ')}`
      : `Business "${business.name}" — profile is complete`;

    return ToolResultHelpers.withData(summary, { profile }, 'business_profile');
  }
}
