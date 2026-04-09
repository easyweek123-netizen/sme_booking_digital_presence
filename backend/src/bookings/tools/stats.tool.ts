import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import { ToolResultHelpers, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { BookingsService } from '../bookings.service';

const BookingsStatsArgsSchema = z.object({});

type BookingsStatsArgs = z.infer<typeof BookingsStatsArgsSchema>;

/**
 * Booking counts for the business (rollup by status + today’s active count).
 */
@ToolHandler({
  name: 'bookings_stats',
  description:
    'Get booking statistics: total active (excluding cancelled), count scheduled for today, pending requests awaiting confirmation, and a per-status breakdown (PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW).',
})
@Injectable()
export class BookingStatsTool extends BaseToolHandler<BookingsStatsArgs> {
  readonly schema = BookingsStatsArgsSchema;

  constructor(private readonly bookingsService: BookingsService) {
    super();
  }

  async execute(_args: BookingsStatsArgs, ctx: ToolContext): Promise<ToolResult> {
    const stats = await this.bookingsService.getStats(
      ctx.businessId,
      ctx.ownerId,
    );

    const { total, today, pending, byStatus } = stats;
    const summary = `You have ${total} active booking(s), ${today} scheduled for today, and ${pending} awaiting your confirmation.`;

    return ToolResultHelpers.withData(summary, {
      total,
      today,
      pending,
      byStatus,
    }, 'bookings');
  }
}
