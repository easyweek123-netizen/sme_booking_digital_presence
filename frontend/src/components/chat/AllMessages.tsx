import { VStack } from '@chakra-ui/react';
import { ChatMessage } from './ChatMessage';
import type { Message } from '../../types/chat.types';

interface AllMessagesProps {
  messages: Message[];
  onSuggestionSelect?: (value: string) => void;
}

export function AllMessages({ messages, onSuggestionSelect }: AllMessagesProps) {
  return (
    <VStack spacing={4} align="stretch" w="full">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          onSuggestionSelect={onSuggestionSelect}
        />
      ))}
    </VStack>
  );
}

