import { baseApi } from './baseApi';
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../../types';

export const notesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notes with optional filters
    getNotes: builder.query<
      Note[],
      { customerId?: number; bookingId?: number }
    >({
      query: ({ customerId, bookingId }) => {
        const params = new URLSearchParams();
        if (customerId) params.append('customerId', customerId.toString());
        if (bookingId) params.append('bookingId', bookingId.toString());
        const queryString = params.toString();
        return `/notes${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Note'],
    }),

    // Get a single note by ID
    getNote: builder.query<Note, number>({
      query: (id) => `/notes/${id}`,
      providesTags: ['Note'],
    }),

    // Create a new note
    createNote: builder.mutation<Note, CreateNoteRequest>({
      query: (data) => ({
        url: '/notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Note'],
    }),

    // Update a note
    updateNote: builder.mutation<Note, { id: number; data: UpdateNoteRequest }>({
      query: ({ id, data }) => ({
        url: `/notes/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Note'],
    }),

    // Delete a note
    deleteNote: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Note'],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;

