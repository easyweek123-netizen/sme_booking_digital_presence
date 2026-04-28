import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  BookingsUpdateStatusArgsSchema,
  createProposal,
  ToolResultHelpers,
  type BookingsUpdateStatusArgs,
  type BookingStatusValue,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { formatLocalYmd } from '../../common/time/local-date';
import { BookingsService } from '../bookings.service';
import { BookingStatus } from '../entities/booking.entity';
import { buildProposalToolMessage } from '../../common/tools';

/**
 * Propose a booking status change for owner confirmation.
 */
@ToolHandler({
  name: 'bookings_update_status',
  description:
    'Change a booking status: CONFIRMED, CANCELLED, COMPLETED, or NO_SHOW. Lookup by booking ID (from bookings_list) or reference code. ' +
    'Requires owner confirmation. Use after bookings_list to get the ID.',
})
@Injectable()
export class UpdateBookingStatusTool extends BaseToolHandler<BookingsUpdateStatusArgs> {
  readonly schema = BookingsUpdateStatusArgsSchema;

  constructor(private readonly bookingsService: BookingsService) {
    super();
  }

  async execute(
    args: BookingsUpdateStatusArgs,
    ctx: ToolContext,
  ): Promise<ToolResult> {
    const booking = await this.bookingsService.findBookingForOwner(
      ctx.businessId,
      ctx.ownerId,
      { id: args.id, reference: args.reference },
    );

    if (!booking) {
      const id =
        args.id !== undefined
          ? `ID ${args.id}`
          : `reference "${args.reference}"`;
      return ToolResultHelpers.notFound('Booking', id);
    }

    const newStatus = args.status as BookingStatus;
    if (booking.status === newStatus) {
      return ToolResultHelpers.success(
        `That booking is already ${booking.status}.`,
      );
    }

    const scheduledSummary = `${this.formatDate(booking.date)} at ${booking.startTime}`;

    const proposal = createProposal('booking:status_update', {
      resolvedId: booking.id,
      reference: booking.reference,
      customerName: booking.customerName,
      serviceName: booking.service?.name,
      scheduledSummary,
      currentStatus: booking.status as BookingStatusValue,
      newStatus: args.status,
    });

    return ToolResultHelpers.withProposal(
      proposal,
      buildProposalToolMessage(
        `booking status ${booking.customerName} (${scheduledSummary}): ${booking.status} → ${args.status}`,
        [proposal],
      ),
      'bookings',
    );
  }

  private formatDate(d: Date): string {
    if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
      return String(d);
    }
    return formatLocalYmd(d);
  }
}
