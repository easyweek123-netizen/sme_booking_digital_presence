import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  NotesDeleteArgsSchema,
  createProposal,
  ToolResultHelpers,
  type NotesDeleteArgs,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { NotesService } from '../notes.service';
import { CustomersService } from '../../customers/customers.service';

@ToolHandler({
  name: 'notes_delete',
  description:
    'Delete a note permanently. Requires note ID from notes_list. Requires owner confirmation. Use only when user explicitly asks to remove a note.',
})
@Injectable()
export class DeleteNoteTool extends BaseToolHandler<NotesDeleteArgs> {
  readonly schema = NotesDeleteArgsSchema;

  constructor(
    private readonly notesService: NotesService,
    private readonly customersService: CustomersService,
  ) {
    super();
  }

  async execute(args: NotesDeleteArgs, ctx: ToolContext): Promise<ToolResult> {
    let note;
    try {
      note = await this.notesService.findOne(args.id, ctx.ownerId);
    } catch {
      return ToolResultHelpers.notFound('Note', `ID ${args.id}`);
    }

    let customerName: string | undefined;
    if (note.customerId) {
      try {
        const customer = await this.customersService.findOneForOwner(
          note.customerId,
          ctx.ownerId,
        );
        customerName = customer.name;
      } catch (error) {
        this.logger.warn(`Could not resolve customer ${note.customerId} for display`, error);
      }
    }

    const contentPreview = note.content.length > 80
      ? note.content.slice(0, 80) + '...'
      : note.content;

    const proposal = createProposal('note:delete', {
      resolvedId: note.id,
      contentPreview,
      customerName,
    });

    return ToolResultHelpers.withProposal(
      proposal,
      `Are you sure you want to delete this note? This cannot be undone.`,
      'clients',
    );
  }
}
