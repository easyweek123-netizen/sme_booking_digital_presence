import { useEffect, useRef } from 'react';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useBusiness } from '../../contexts/useBusiness';
import { useAppDispatch } from '../../store/hooks';
import { addProposals, setPreviewContext } from '../../store/slices/canvasSlice';
import { AllMessages } from './AllMessages';
import { ChatInput } from './ChatInput';
import { ChatTabStrip } from './ChatTabStrip';
import { TypingIndicator } from './TypingIndicator';
import { SparkleIcon } from '../icons';
import { useConversation } from './hooks/useConversation';

export function ChatPanel() {
  const dispatch = useAppDispatch();
  const business = useBusiness();
  const businessName = business.name;

  const {
    activeTabId,
    openTabIds,
    conversations,
    isLoadingConversations,
    messages,
    isSendingMessage,
    startChat,
    sendText,
  } = useConversation();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-create first conversation (idempotent inside the hook)
  useEffect(() => {
    startChat();
  }, [startChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isSendingMessage, activeTabId]);

  const handleSubmit = async (text: string) => {
    if (activeTabId === null) return;
    try {
      const reply = await sendText(text);
      if (reply?.previewContext) dispatch(setPreviewContext(reply.previewContext));
      if (reply?.proposals?.length) dispatch(addProposals(reply.proposals));
    } catch {
      console.log('error handleSubmit');
    }
  };

  const isBusy = isSendingMessage || activeTabId === null;
  const showEmptyState =
    activeTabId !== null && messages.length === 0 && !isBusy;

  return (
    <Flex direction="column" h="full" overflow="hidden" bg="surface.page">
      <HStack
        flexShrink={0}
        align="center"
        p={2}
        borderBottom="1px"
        borderColor="border.subtle"
        bg="surface.card"
      >
        <ChatTabStrip
          conversations={conversations}
          activeTabId={activeTabId}
          openTabIds={openTabIds}
          isLoadingConversations={isLoadingConversations}
        />
      </HStack>

      <Box flex={1} overflow="auto" px={4}>
        <VStack spacing={4} align="stretch" py={6}>
          {showEmptyState && (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={16}
              color="text.faint"
            >
              <Box
                p={4}
                borderRadius="sm"
                bg="surface.alt"
                color="accent.primary"
                mb={4}
              >
                <SparkleIcon size={32} />
              </Box>
              <Text fontSize="lg" fontWeight="500" color="text.muted">
                How can I help you today?
              </Text>
              <Text fontSize="sm" color="text.faint" mt={1}>
                Ask {businessName} anything about your business
              </Text>
            </Flex>
          )}

          <AllMessages messages={messages} onSuggestionSelect={handleSubmit} />
          {isBusy && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <Box flexShrink={0} px={4} py={2}>
        <ChatInput
          placeholder="Ask me anything..."
          onSubmit={handleSubmit}
          disabled={isBusy}
        />
      </Box>
    </Flex>
  );
}