import { baseApi } from './baseApi';
import type {
  Message,
  ActionResultRequest,
  Conversation,
} from '../../types/chat.types';

function actionStatusToUserMessage(
  status: ActionResultRequest['status'],
): string {
  switch (status) {
    case 'confirmed':
      return '[Action confirmed] — changes applied.';
    case 'cancelled':
      return '[Action cancelled] — no changes were made.';
    case 'modified':
      return '[Action modified] — custom changes were applied.';
    default:
      return '[Action updated].';
  }
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listConversations: builder.query<Conversation[], void>({
      query: () => '/chat/conversations',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Conversation' as const,
                id,
              })),
              { type: 'Conversation' as const, id: 'LIST' },
            ]
          : [{ type: 'Conversation' as const, id: 'LIST' }],
    }),

    createConversation: builder.mutation<Conversation, void>({
      query: () => ({ url: '/chat/conversations', method: 'POST' }),
      invalidatesTags: [{ type: 'Conversation' as const, id: 'LIST' }],
    }),

    deleteConversation: builder.mutation<void, number>({
      query: (id) => ({ url: `/chat/conversations/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Conversation' as const, id },
        { type: 'Conversation' as const, id: 'LIST' },
        { type: 'ConversationMessages' as const, id },
      ],
    }),

    getConversationMessages: builder.query<Message[], number>({
      query: (id) => `/chat/conversations/${id}/messages`,
      providesTags: (_r, _e, id) => [
        { type: 'ConversationMessages' as const, id },
      ],
    }),

    sendMessage: builder.mutation<
      Message,
      { conversationId: number; message: string | null }
    >({
      query: ({ conversationId, message }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: 'POST',
        body: { message },
      }),
      async onQueryStarted(
        { conversationId, message },
        { dispatch, queryFulfilled },
      ) {
        const text = message?.trim();
        const optimisticPatch =
          text && text.length > 0
            ? dispatch(
                chatApi.util.updateQueryData(
                  'getConversationMessages',
                  conversationId,
                  (draft) => {
                    draft.push({ role: 'user', content: text });
                  },
                ),
              )
            : null;

        try {
          const { data: reply } = await queryFulfilled;
          dispatch(
            chatApi.util.updateQueryData(
              'getConversationMessages',
              conversationId,
              (draft) => {
                draft.push(reply);
              },
            ),
          );
        } catch {
          optimisticPatch?.undo();
        }
      },
    }),
    sendActionResult: builder.mutation<Message, ActionResultRequest>({
      query: ({ conversationId, ...body }) => ({
        url: `/chat/conversations/${conversationId}/actions`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(
        { conversationId, status },
        { dispatch, queryFulfilled },
      ) {
        try {
          const { data: reply } = await queryFulfilled;
          const confirmedUserMessage = actionStatusToUserMessage(status);
    
          dispatch(
            chatApi.util.updateQueryData(
              'getConversationMessages',
              conversationId,
              (draft) => {
                // Add confirmation only after backend action succeeds
                draft.push({ role: 'user', content: confirmedUserMessage });
                draft.push(reply);
              },
            ),
          );
        } catch(error) {
          console.error('Error sending action result', error);
        }
      },
    }),
    // sendActionResult: builder.mutation<Message, ActionResultRequest>({
    //   query: ({ conversationId, ...body }) => ({
    //     url: `/chat/conversations/${conversationId}/actions`,
    //     method: 'POST',
    //     body,
    //   }),
    //   async onQueryStarted(
    //     { conversationId, status },
    //     { dispatch, queryFulfilled },
    //   ) {
    //     const optimisticUserMessage = actionStatusToUserMessage(status);

    //     const optimisticPatch = dispatch(
    //       chatApi.util.updateQueryData(
    //         'getConversationMessages',
    //         conversationId,
    //         (draft) => {
    //           draft.push({ role: 'user', content: optimisticUserMessage });
    //         },
    //       ),
    //     );

    //     try {
    //       const { data: reply } = await queryFulfilled;
    //       dispatch(
    //         chatApi.util.updateQueryData(
    //           'getConversationMessages',
    //           conversationId,
    //           (draft) => {
    //             draft.push(reply);
    //           },
    //         ),
    //       );
    //     } catch {
    //       optimisticPatch.undo();
    //     }
    //   },
    // }),
  }),
});

export const {
  useListConversationsQuery,
  useCreateConversationMutation,
  useDeleteConversationMutation,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useSendActionResultMutation,
} = chatApi;
