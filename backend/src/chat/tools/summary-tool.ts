import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, type ToolResult, type SummaryCard } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import type { Business } from '../../business/entities/business.entity';
import { BusinessService } from '../../business/business.service';
import { businessAddressLine, businessAddressCity } from '../../locations/types/business-location-lookup';
import { FLOW_META } from './onboarding-flows';

const ShowSummaryArgsSchema = z.object({
  preset: z.enum(['branding', 'location', 'service', 'all']),
});
type ShowSummaryArgs = z.infer<typeof ShowSummaryArgsSchema>;

@ToolHandler({
  name: 'show_summary',
  description:
    'Render an inline ✓ summary card after a setup step saves. preset="all" renders the final ' +
    '"ready to share" card with the booking link. Call right after [Action confirmed] for a wizard.',
})
@Injectable()
export class ShowSummaryTool extends BaseToolHandler<ShowSummaryArgs> {
  readonly schema = ShowSummaryArgsSchema;
  constructor(
    private readonly businessService: BusinessService,
    private readonly config: ConfigService,
  ) { super(); }

  async execute(args: ShowSummaryArgs, ctx: ToolContext): Promise<ToolResult> {
    const business = await this.businessService.findByOwnerId(ctx.ownerId);
    if (!business) return ToolResultHelpers.error('No business found.');

    if (args.preset === 'all') {
      const appUrl = this.config.get<string>('FRONTEND_APP_URL', 'https://');
      const card: SummaryCard = {
        kind: 'summary',
        title: 'Your booking page is ready to share.',
        shareUrl: `${appUrl}/book/${business.slug}`,
      };
      return ToolResultHelpers.withCards(card, 'Rendered share card.');
    }

    const card: SummaryCard = {
      kind: 'summary',
      title: `${FLOW_META[args.preset].label} saved`,
      preset: args.preset,
      snapshot: buildSnapshot(args.preset, business),
    };
    return ToolResultHelpers.withCards(card, `Rendered ${args.preset} summary.`);
  }
}

function buildSnapshot(preset: 'branding' | 'location' | 'service', b: Business): Record<string, unknown> {
  if (preset === 'branding') {
    return { name: b.name, tagline: b.description ?? null,
             brandColor: b.brandColor ?? null, about: b.aboutContent ?? null };
  }
  if (preset === 'location') {
    return { address: businessAddressLine(b), city: businessAddressCity(b)?.city ?? null,
             // workingHours is projected onto the read model (not on the entity type) → cast.
             workingHours: (b as { workingHours?: unknown }).workingHours ?? null };
  }
  const s = b.services?.[0];
  return s ? { name: s.name, price: s.price, duration: s.durationMinutes, type: s.type } : {};
}