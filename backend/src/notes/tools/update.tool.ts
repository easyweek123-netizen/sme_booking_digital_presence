import { Injectable } from '@nestjs/common';
import { ToolHandler, BaseToolHandler } from '../../common/tools';
import {
  NotesUpdateArgsSchema,
  createProposal,
  ToolResultHelpers,
  type NotesUpdateArgs,
  type ToolResult,
} from '@bookeasy/shared';
import type { ToolContext } from '../../common';
import { NotesService } from '../notes.service';
import { CustomersService } from '../../customers/customers.service';
import { buildProposalToolMessage } from '../../common/tools';

@ToolHandler({
  name: 'notes_update',
  description:
    'Update note content. Requires note ID from notes_list and new content text. Replaces the entire note content.',
})
@Injectable()
export class UpdateNoteTool extends BaseToolHandler<NotesUpdateArgs> {
  readonly schema = NotesUpdateArgsSchema;

  constructor(
    private readonly notesService: NotesService,
    private readonly customersService: CustomersService,
  ) {
    super();
  }

  async execute(args: NotesUpdateArgs, ctx: ToolContext): Promise<ToolResult> {
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
        this.logger.warn(
          `Could not resolve customer ${note.customerId} for display`,
          error,
        );
      }
    }

    const proposal = createProposal('note:update', {
      resolvedId: note.id,
      content: args.content,
      customerName,
    });

    return ToolResultHelpers.withProposal(
      proposal,
      buildProposalToolMessage('note update', [proposal]),
      'clients',
    );
  }
}
