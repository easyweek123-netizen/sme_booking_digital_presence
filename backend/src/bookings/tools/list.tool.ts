import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  BookingsListFiltersSchema,
  ToolResultHelpers,
  type BookingsListFilters,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { formatLocalYmd } from '../../common/time/local-date';
import { BookingsService } from '../bookings.service';
import { BookingStatus } from '../entities/booking.entity';

/**
 * List bookings for the business with optional filters.
 */
@ToolHandler({
  name: 'bookings_list',
  description:
    'List bookings with optional filters: status (PENDING/CONFIRMED/CANCELLED/COMPLETED/NO_SHOW), date range (from/to as YYYY-MM-DD). ' +
    'Call server_clock first when user says "today" or "this week" to get the real date. Returns IDs and references for follow-up with bookings_update_status.',
})
@Injectable()
export class ListBookingsTool extends BaseToolHandler<BookingsListFilters> {
  readonly schema = BookingsListFiltersSchema;

  constructor(private readonly bookingsService: BookingsService) {
    super();
  }

  async execute(args: BookingsListFilters, ctx: ToolContext): Promise<ToolResult> {
    const bookings = await this.bookingsService.findByBusiness(
      ctx.businessId,
      ctx.ownerId,
      {
        status: args.status as BookingStatus | undefined,
        from: args.from,
        to: args.to,
      },
    );

    if (bookings.length === 0) {
      return ToolResultHelpers.success(
        'No bookings match those filters.',
      );
    }

    const summary = bookings
      .map((b) => {
        const dateStr = this.formatDate(b.date);
        const svc = b.service?.name ?? 'Service';
        return `${b.customerName} — ${svc} on ${dateStr} at ${b.startTime} (${b.status})`;
      })
      .join('; ');

    const bookingData = bookings.map((b) => ({
      id: b.id,
      reference: b.reference,
      status: b.status,
      date: this.formatDate(b.date),
      startTime: b.startTime,
      endTime: b.endTime,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      serviceName: b.service?.name,
    }));

    return ToolResultHelpers.withData(
      `Found ${bookings.length} booking(s): ${summary}`,
      { bookings: bookingData },
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
