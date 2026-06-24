import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { openTab, setActiveTab } from '../../../store/slices/chatSlice';
import {
  useCreateConversationMutation,
  useGetConversationMessagesQuery,
  useListConversationsQuery,
  useSendMessageMutation,
} from '../../../store/api/chatApi';
import type { Message } from '../../../types/chat.types';

export interface UseConversationResult {
  conversations: {
    id: number;
    title: string;
    lastMessageAt: string | null;
    createdAt: string;
  }[];
  isLoadingConversations: boolean;

  activeTabId: number | null;
  openTabIds: number[];

  messages: Message[];
  isSendingMessage: boolean;

  startChat: () => Promise<Message | undefined>;
  sendText: (text: string) => Promise<Message | null>;
}

export function useConversation(): UseConversationResult {
  const dispatch = useAppDispatch();

  const openTabIds = useAppSelector((s) => s.chat.openTabIds);
  const activeTabId = useAppSelector((s) => s.chat.activeTabId);

  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
  } = useListConversationsQuery();

  const conversations = conversationsData ?? [];

  const {
    data: serverMessages = [],
    isLoading: isLoadingMessages,
  } = useGetConversationMessagesQuery(activeTabId ?? 0, {
    skip: activeTabId === null,
  });

  const [sendMessageMutation, { isLoading: isSendingMessageMutation }] =
    useSendMessageMutation();

  const [
    createConversation,
    { isLoading: isCreatingConversation, isSuccess: didCreateConversation },
  ] = useCreateConversationMutation();

  const startChat = useCallback(async () => {
    if (isLoadingConversations) return;
    if (conversations.length > 0) return;
    if (isCreatingConversation || didCreateConversation) return;

    const created = await createConversation().unwrap();

    dispatch(openTab(created.id));
    dispatch(setActiveTab(created.id));

    return sendMessageMutation({
      conversationId: created.id,
      message: null,
    }).unwrap();
  }, [
    isLoadingConversations,
    conversations.length,
    isCreatingConversation,
    didCreateConversation,
    createConversation,
    dispatch,
    sendMessageMutation,
  ]);

  const sendText = useCallback(
    async (text: string) => {
      if (activeTabId === null) return null;

      return sendMessageMutation({
        conversationId: activeTabId,
        message: text,
      }).unwrap();
    },
    [activeTabId, sendMessageMutation],
  );

  const isSendingMessage = isSendingMessageMutation || isLoadingMessages;

  useEffect(() => {
    if (isLoadingConversations) return;
    if (conversations.length === 0) return;
    if (openTabIds.length > 0) return;

    const idToOpen = activeTabId ?? conversations[0].id;
    dispatch(openTab(idToOpen));
  }, [
    isLoadingConversations,
    conversations.length,
    openTabIds.length,
    activeTabId,
    dispatch,
  ]);

  return {
    conversations,
    isLoadingConversations,

    activeTabId,
    openTabIds,

    messages: serverMessages,
    isSendingMessage,

    startChat,
    sendText,
  };
}
