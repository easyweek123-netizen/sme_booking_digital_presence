import { useEffect, useRef } from 'react';
import { Box, Flex, VStack, Text, HStack } from '@chakra-ui/react';
import { useInitChatQuery, useSendMessageMutation, useGetMyBusinessQuery } from '../../store/api';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addMessage, setInitialized, clearChat } from '../../store/slices/chatSlice';
import { AllMessages, ChatInput, TypingIndicator } from '../../components/chat';
import { SparkleIcon } from '../../components/icons';
import type { Message } from '../../types/chat.types';

export function DashboardChat() {
  const dispatch = useAppDispatch();
  const { messages, initialized } = useAppSelector((state) => state.chat);
  const { data: business } = useGetMyBusinessQuery();
  const { data: initData, isLoading: isInitLoading, refetch } = useInitChatQuery(undefined, {
    skip: initialized,
  });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const businessName = business?.name || 'Your';

  useEffect(() => {
    if (initData && !initialized) {
      dispatch(addMessage(initData));
      dispatch(setInitialized(true));
    }
  }, [initData, initialized, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = async (text: string) => {
    const userMessage: Message = { role: 'user', content: text };
    dispatch(addMessage(userMessage));

    try {
      const response = await sendMessage({ message: text }).unwrap();
      dispatch(addMessage(response));
    } catch {
      dispatch(addMessage({ 
        role: 'bot', 
        content: 'Sorry, something went wrong. Please try again.' 
      }));
    }
  };

  const handleSuggestionSelect = (value: string) => {
    handleSubmit(value);
  };

  const handleClearChat = () => {
    dispatch(clearChat());
    refetch();
  };

  return (
    <Flex 
      direction="column" 
      position="absolute" 
      inset={0} 
      overflow="hidden"
      bg="linear-gradient(180deg, rgba(46, 182, 125, 0.03) 0%, transparent 50%)"
    >
      {/* Header */}
      <HStack 
        flexShrink={0} 
        justify="space-between" 
        align="center"
        px={4}
        py={3}
        borderBottom="1px"
        borderColor="gray.100"
        bg="white"
      >
        <HStack spacing={2}>
          <Box
            p={1.5}
            borderRadius="lg"
            bg="brand.50"
            color="brand.500"
          >
            <SparkleIcon size={16} />
          </Box>
          <Text fontWeight="600" color="gray.700" fontSize="sm">
            {businessName}'s AI Assistant
          </Text>
        </HStack>
        
        {messages.length > 0 && (
          <Text
            as="button"
            fontSize="xs"
            color="gray.400"
            cursor="pointer"
            onClick={handleClearChat}
            px={2}
            py={1}
            borderRadius="md"
            _hover={{ color: 'gray.600', bg: 'gray.50' }}
            transition="all 0.2s"
          >
            New chat
          </Text>
        )}
      </HStack>

      {/* Messages area */}
      <Box flex={1} overflow="auto" px={4}>
        <VStack 
          spacing={4} 
          align="stretch" 
          maxW="720px" 
          mx="auto" 
          py={6}
        >
          {messages.length === 0 && !isInitLoading && (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              py={16}
              color="gray.400"
            >
              <Box
                p={4}
                borderRadius="2xl"
                bg="gray.50"
                color="gray.300"
                mb={4}
              >
                <SparkleIcon size={32} />
              </Box>
              <Text fontSize="lg" fontWeight="500" color="gray.500">
                How can I help you today?
              </Text>
              <Text fontSize="sm" color="gray.400" mt={1}>
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
      <Box 
        flexShrink={0} 
        px={4} 
        py={4}
        borderTop="1px"
        borderColor="gray.100"
      >
        <Box maxW="720px" mx="auto">
          <ChatInput
            placeholder="Ask me anything..."
            onSubmit={handleSubmit}
            disabled={isSending || isInitLoading}
          />
        </Box>
      </Box>
    </Flex>
  );
}
