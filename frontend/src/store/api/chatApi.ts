import { baseApi } from './baseApi';
import type { Message, ActionResultRequest } from '../../types/chat.types';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initChat: builder.query<Message, void>({
      query: () => '/chat/init',
    }),
    sendMessage: builder.mutation<Message, { message: string }>({
      query: (body) => ({
        url: '/chat',
        method: 'POST',
        body,
      }),
    }),
    /** Send action result (confirm/cancel) and get AI follow-up */
    sendActionResult: builder.mutation<Message, ActionResultRequest>({
      query: (body) => ({
        url: '/chat/action-result',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useInitChatQuery, 
  useSendMessageMutation,
  useSendActionResultMutation,
} = chatApi;

