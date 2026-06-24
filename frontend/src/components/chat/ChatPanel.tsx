import { useEffect, useRef } from 'react';
import { Box, Flex, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { useBusiness } from '../../contexts/business';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addProposals, setPreviewContext } from '../../store/slices/canvasSlice';
import { setActiveWizard } from '../../store/slices/chatSlice';
import { AllMessages } from './AllMessages';
import { ChatInput } from './ChatInput';
import { ChatTabStrip } from './ChatTabStrip';
import { TypingIndicator } from './TypingIndicator';
import { SparkleIcon } from '../icons';
import { useConversation } from './hooks/useConversation';
import { WorkflowExecutionWizard } from './wizard/WorkflowExecutionWizard';
import { openCanvas } from '../../store/slices/previewSlice';

export function ChatPanel() {
  const dispatch = useAppDispatch();
  const business = useBusiness();
  const businessName = business.name;
  const activeWizard = useAppSelector((s) => s.chat.activeWizard);
  
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

  // Auto-create first conversation
  useEffect(() => {
    (async () => {
      const reply = await startChat();
      if (reply?.wizard) dispatch(setActiveWizard(reply.wizard));
      if (reply) dispatch(openCanvas());
      if (reply?.previewContext) dispatch(setPreviewContext(reply.previewContext));
      if (reply?.proposals?.length) dispatch(addProposals(reply.proposals));
    })();
  }, [startChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isSendingMessage, activeTabId]);

  const handleSubmit = async (text: string) => {
    if (activeTabId === null) return;
    try {
      const reply = await sendText(text);
      if (reply?.wizard) dispatch(setActiveWizard(reply.wizard));
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
        px={3}
        py={4}
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
        <VStack spacing={4} align="stretch" py={4}>
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

      <Stack px={4} py={2} overflow="auto">
        {activeWizard && <WorkflowExecutionWizard key={activeWizard.proposalId} wizard={activeWizard} />}
        <ChatInput
          placeholder="Ask me anything..."
          onSubmit={handleSubmit}
          disabled={isBusy}
        />
      </Stack>
    </Flex>
  );
}