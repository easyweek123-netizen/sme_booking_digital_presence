import { useEffect, useRef } from 'react';
import { Box, Flex, VStack, Text, HStack } from '@chakra-ui/react';
import { useInitChatQuery, useSendMessageMutation } from '../../store/api';
import { useBusiness } from '../../contexts/useBusiness';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addMessage, setInitialized, clearChat } from '../../store/slices/chatSlice';
import {
  setProposals,
  addProposals,
  setPreviewContext,
  clearProposals,
} from '../../store/slices/canvasSlice';
import { AllMessages } from './AllMessages';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { SparkleIcon } from '../icons';
import type { Message } from '../../types/chat.types';

/**
 * Chat panel for CanvasChat layout.
 * Dispatches proposals to canvas slice when AI returns action proposals.
 */
export function ChatPanel() {
  const dispatch = useAppDispatch();
  const { messages, initialized } = useAppSelector((state) => state.chat);
  const business = useBusiness();
  const { data: initData, isLoading: isInitLoading, refetch } = useInitChatQuery(undefined, {
    skip: initialized,
  });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const businessName = business.name;

  // Handle initial chat message
  useEffect(() => {
    if (initData && !initialized) {
      dispatch(addMessage(initData));
      dispatch(setInitialized(true));
      
      // If init message has proposals, dispatch to canvas
      if (initData.proposals && initData.proposals.length > 0) {
        dispatch(setProposals(initData.proposals));
      }
    }
  }, [initData, initialized, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = async (text: string) => {
    const userMessage: Message = { role: 'user', content: text };
    dispatch(addMessage(userMessage));

    try {
      const response = await sendMessage({ message: text }).unwrap();
      dispatch(addMessage(response));
      
      // Handle previewContext - switch preview tab content
      if (response.previewContext) {
        dispatch(setPreviewContext(response.previewContext));
      }
      
      // Handle proposals - show in actions tab
      if (response.proposals && response.proposals.length > 0) {
        dispatch(addProposals(response.proposals));
      }
    } catch (err: unknown) {
      // 401 is handled globally by baseQueryWithAuth (shows toast + redirects to login).
      // Only surface a chat-level error for other failures.
      const status = (err as { status?: number })?.status;
      if (status !== 401) {
        dispatch(addMessage({
          role: 'bot',
          content: 'Sorry, something went wrong. Please try again.',
        }));
      }
    }
  };

  const handleSuggestionSelect = (value: string) => {
    handleSubmit(value);
  };

  const handleClearChat = () => {
    dispatch(clearChat());
    dispatch(clearProposals());
    refetch();
  };

  return (
    <Flex
      direction="column"
      h="full"
      overflow="hidden"
      bg="surface.page"
    >
      {/* Header */}
      <HStack
        flexShrink={0}
        justify="space-between"
        align="center"
        px={4}
        py={3}
        borderBottom="1px"
        borderColor="border.subtle"
        bg="surface.card"
      >
        <HStack spacing={2}>
          <Box p={1.5} borderRadius="sm" bg="brand.50" color="accent.primary">
            <SparkleIcon size={16} />
          </Box>
          <Text fontWeight="600" color="text.strong" fontSize="sm">
            {businessName}'s AI Assistant
          </Text>
        </HStack>

        {messages.length > 0 && (
          <Text
            as="button"
            fontSize="xs"
            color="text.faint"
            cursor="pointer"
            onClick={handleClearChat}
            px={2}
            py={1}
            borderRadius="sm"
            _hover={{ color: 'text.secondary', bg: 'surface.alt' }}
            transition="all 0.2s"
          >
            New chat
          </Text>
        )}
      </HStack>

      {/* Messages area */}
      <Box flex={1} overflow="auto" px={4}>
        <VStack spacing={4} align="stretch" py={6}>
          {messages.length === 0 && !isInitLoading && (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={16}
              color="text.faint"
            >
              <Box p={4} borderRadius="sm" bg="surface.alt" color="accent.primary" mb={4}>
                <SparkleIcon size={32} />
              </Box>
              <Text fontSize="lg" fontWeight="500" color="text.muted">
                How can I help you today?
              </Text>
              <Text fontSize="sm" color="text.faint" mt={1}>
                Ask me anything about your business
              </Text>
            </Flex>
          )}

          <AllMessages messages={messages} onSuggestionSelect={handleSuggestionSelect} />
          {(isSending || isInitLoading) && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input area */}
      <Box flexShrink={0} px={4} py={4} borderTop="1px" borderColor="border.subtle">
        <ChatInput
          placeholder="Ask me anything..."
          onSubmit={handleSubmit}
          disabled={isSending || isInitLoading}
        />
      </Box>
    </Flex>
  );
}

