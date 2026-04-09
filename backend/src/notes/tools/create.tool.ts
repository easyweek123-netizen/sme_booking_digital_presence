import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  NotesCreateArgsSchema,
  createProposal,
  ToolResultHelpers,
  type NotesCreateArgs,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { CustomersService } from '../../customers/customers.service';

@ToolHandler({
  name: 'notes_create',
  description:
    'Add a note for a customer or booking. Use customer ID from customers_list (preferred) or customer name as fallback. bookingId MUST be a real ID from customers_list or customers_get — never guess or invent one.',
})
@Injectable()
export class CreateNoteTool extends BaseToolHandler<NotesCreateArgs> {
  readonly schema = NotesCreateArgsSchema;

  constructor(private readonly customersService: CustomersService) {
    super();
  }

  async execute(args: NotesCreateArgs, ctx: ToolContext): Promise<ToolResult> {
    let resolvedCustomerId = args.customerId ?? null;
    let resolvedCustomerName = args.customerName;

    if (resolvedCustomerId === null && args.customerName) {
      const customer = await this.customersService.findByNameForOwner(
        args.customerName,
        ctx.ownerId,
      );
      if (!customer) {
        return ToolResultHelpers.notFound('Customer', args.customerName);
      }
      resolvedCustomerId = customer.id;
      resolvedCustomerName = customer.name;
    }

    if (resolvedCustomerId !== null && !resolvedCustomerName) {
      try {
        const customer = await this.customersService.findOneForOwner(
          resolvedCustomerId,
          ctx.ownerId,
        );
        resolvedCustomerName = customer.name;
      } catch {
        return ToolResultHelpers.notFound('Customer', `ID ${resolvedCustomerId}`);
      }
    }

    const proposal = createProposal('note:create', {
      content: args.content,
      customerId: resolvedCustomerId,
      bookingId: args.bookingId ?? null,
      customerName: resolvedCustomerName,
    });

    const target = resolvedCustomerName
      ? `for ${resolvedCustomerName}`
      : `for booking #${args.bookingId}`;

    return ToolResultHelpers.withProposal(
      proposal,
      `I've prepared a note ${target}. Please review and confirm.`,
      'clients',
    );
  }
}
