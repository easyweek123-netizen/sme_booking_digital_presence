import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Suggestions } from './Suggestions';
import type { Message } from '../../types/chat.types';

const MotionBox = motion.create(Box);

interface ChatMessageProps {
  message: Message;
  onSuggestionSelect?: (value: string) => void;
}

export function ChatMessage({ message, onSuggestionSelect }: ChatMessageProps) {
  const isBot = message.role === 'bot';

  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      alignSelf={isBot ? 'flex-start' : 'flex-end'}
      maxW="85%"
      bg={isBot ? 'white' : 'brand.500'}
      color={isBot ? 'gray.700' : 'white'}
      px={4}
      py={3}
      borderRadius="2xl"
      borderTopLeftRadius={isBot ? 'lg' : '2xl'}
      borderTopRightRadius={isBot ? '2xl' : 'lg'}
      boxShadow={isBot ? 'sm' : 'md'}
      border={isBot ? '1px solid' : 'none'}
      borderColor="gray.100"
      background={!isBot ? 'linear-gradient(135deg, var(--chakra-colors-brand-500) 0%, var(--chakra-colors-brand-600) 100%)' : undefined}
    >
      <Text fontSize="sm" lineHeight="tall" whiteSpace="pre-wrap">
        {message.content}
      </Text>
      {message.suggestions && onSuggestionSelect && (
        <Suggestions
          suggestions={message.suggestions}
          onSelect={onSuggestionSelect}
        />
      )}
    </MotionBox>
  );
}
