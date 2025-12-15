import { baseApi } from './baseApi';
import type { Message } from '../../types/chat.types';

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
  }),
});

export const { useInitChatQuery, useSendMessageMutation } = chatApi;

