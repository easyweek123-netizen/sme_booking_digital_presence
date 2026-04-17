import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  CustomersListArgsSchema,
  ToolResultHelpers,
  type CustomersListArgs,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { formatLocalYmd } from '../../common/time/local-date';
import { CustomersService } from '../customers.service';

@ToolHandler({
  name: 'customers_list',
  description:
    'List all customers or search by name/email. Returns IDs, booking counts, and last booking date. ' +
    'Use before customers_get, notes_create, or notes_list to get the customer ID.',
})
@Injectable()
export class ListCustomersTool extends BaseToolHandler<CustomersListArgs> {
  readonly schema = CustomersListArgsSchema;

  constructor(private readonly customersService: CustomersService) {
    super();
  }

  async execute(args: CustomersListArgs, ctx: ToolContext): Promise<ToolResult> {
    const customers = await this.customersService.findAllForOwner(
      ctx.ownerId,
      args.search,
    );

    if (customers.length === 0) {
      const msg = args.search
        ? `No customers found matching "${args.search}".`
        : 'You don\'t have any customers yet. Customers appear after they make their first booking.';
      return ToolResultHelpers.success(msg);
    }

    const summary = customers
      .map((c) => {
        const bookingCount = c.bookings?.length ?? 0;
        return `${c.name} (${bookingCount} booking${bookingCount !== 1 ? 's' : ''})`;
      })
      .join(', ');

    const customerData = customers.map((c) => {
      const bookings = (c.bookings ?? [])
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        bookingCount: bookings.length,
        lastBookingDate: bookings.length > 0 ? this.formatDate(bookings[0].date) : null,
        bookings: bookings.map((b) => ({
          id: b.id,
          date: this.formatDate(b.date),
          status: b.status,
        })),
      };
    });

    return ToolResultHelpers.withData(
      `Found ${customers.length} customer(s): ${summary}`,
      { customers: customerData },
      'clients',
    );
  }

  private formatDate(d: Date): string {
    if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
      return String(d);
    }
    return formatLocalYmd(d);
  }
}
