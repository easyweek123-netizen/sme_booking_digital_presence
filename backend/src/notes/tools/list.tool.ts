import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  NotesListFiltersSchema,
  ToolResultHelpers,
  type NotesListFilters,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { NotesService } from '../notes.service';

@ToolHandler({
  name: 'notes_list',
  description:
    'List notes for a customer or booking. Use customer ID from customers_list or booking ID from bookings_list. Returns note IDs for follow-up operations.',
})
@Injectable()
export class ListNotesTool extends BaseToolHandler<NotesListFilters> {
  readonly schema = NotesListFiltersSchema;

  constructor(private readonly notesService: NotesService) {
    super();
  }

  async execute(args: NotesListFilters, ctx: ToolContext): Promise<ToolResult> {
    const notes = await this.notesService.findAll(ctx.ownerId, {
      customerId: args.customerId,
      bookingId: args.bookingId,
    });

    if (notes.length === 0) {
      return ToolResultHelpers.success('No notes found.');
    }

    const preview = notes
      .map((n) => {
        const snippet = n.content.length > 60
          ? n.content.slice(0, 60) + '...'
          : n.content;
        return `[${n.id}] ${snippet}`;
      })
      .join('; ');

    const noteData = notes.map((n) => ({
      id: n.id,
      content: n.content,
      customerId: n.customerId,
      bookingId: n.bookingId,
      createdAt: n.createdAt.toISOString(),
    }));

    return ToolResultHelpers.withData(
      `Found ${notes.length} note(s): ${preview}`,
      { notes: noteData },
      'clients',
    );
  }
}
