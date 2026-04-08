import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '../../store/api';
import { NoteProposal } from '../../components/canvas/NoteProposal';
import { DeleteConfirmation } from '../../components/canvas/DeleteConfirmation';
import { defineHandler, type RuntimeActionHandler } from './types';
import type {
  NoteCreateAction,
  NoteUpdateAction,
  NoteDeleteAction,
} from '@shared';

// ─────────────────────────────────────────────────────────────────────────────
// Note Actions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Note entity action handlers.
 * Uses defineHandler for type-safe action and formData typing.
 */
export function useNoteActions(): Record<string, RuntimeActionHandler> {
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  return {
    'note:create': defineHandler<NoteCreateAction, { content: string }>({
      component: NoteProposal,
      title: 'Add Note',
      getProps: (action) => ({
        content: action.content,
        customerName: action.customerName,
        isUpdate: false,
      }),
      execute: async (action, formData) => {
        await createNote({
          content: formData.content,
          customerId: action.customerId ?? undefined,
          bookingId: action.bookingId ?? undefined,
        }).unwrap();
      },
    }),

    'note:update': defineHandler<NoteUpdateAction, { content: string }>({
      component: NoteProposal,
      title: 'Update Note',
      getProps: (action) => ({
        content: action.content,
        customerName: action.customerName,
        isUpdate: true,
      }),
      execute: async (action, formData) => {
        await updateNote({
          id: action.resolvedId,
          data: { content: formData.content },
        }).unwrap();
      },
    }),

    'note:delete': defineHandler<NoteDeleteAction, { confirmed: boolean }>({
      component: DeleteConfirmation,
      title: 'Delete Note',
      getProps: (action) => ({
        entityType: 'note',
        id: action.resolvedId,
        name: action.contentPreview,
      }),
      execute: async (action) => {
        await deleteNote(action.resolvedId).unwrap();
      },
    }),
  };
}
