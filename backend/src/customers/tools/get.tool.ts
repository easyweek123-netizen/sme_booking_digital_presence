import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  CustomersGetArgsSchema,
  ToolResultHelpers,
  type CustomersGetArgs,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { formatLocalYmd } from '../../common/time/local-date';
import { CustomersService } from '../customers.service';

@ToolHandler({
  name: 'customers_get',
  description:
    'Get a single customer with full booking history. Lookup by ID (preferred, from customers_list) or name. ' +
    'Use when user asks about a specific customer. Returns recent bookings and contact info.',
})
@Injectable()
export class GetCustomerTool extends BaseToolHandler<CustomersGetArgs> {
  readonly schema = CustomersGetArgsSchema;

  constructor(private readonly customersService: CustomersService) {
    super();
  }

  async execute(args: CustomersGetArgs, ctx: ToolContext): Promise<ToolResult> {
    let customerId = args.id;

    if (customerId === undefined && args.name) {
      const customer = await this.customersService.findByNameForOwner(
        args.name,
        ctx.ownerId,
      );
      if (!customer) {
        return ToolResultHelpers.notFound('Customer', args.name);
      }
      customerId = customer.id;
    }

    if (customerId === undefined) {
      return ToolResultHelpers.error('Either id or name is required');
    }

    try {
      const customer = await this.customersService.findOneForOwner(
        customerId,
        ctx.ownerId,
      );

      const bookings = (customer.bookings ?? []).map((b) => ({
        id: b.id,
        date: this.formatDate(b.date),
        startTime: b.startTime,
        status: b.status,
        serviceName: b.service?.name ?? 'Unknown',
      }));

      return ToolResultHelpers.withData(
        `${customer.name} — ${bookings.length} booking(s), email: ${customer.email ?? 'not provided'}`,
        {
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            createdAt: customer.createdAt.toISOString(),
            bookingCount: bookings.length,
          },
          recentBookings: bookings.slice(0, 10),
        },
        'clients',
      );
    } catch {
      const identifier =
        args.id !== undefined ? `ID ${args.id}` : `"${args.name}"`;
      return ToolResultHelpers.notFound('Customer', identifier);
    }
  }

  private formatDate(d: Date): string {
    if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
      return String(d);
    }
    return formatLocalYmd(d);
  }
}
