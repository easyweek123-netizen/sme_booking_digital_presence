import { useEffect, useState } from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Suggestions } from './Suggestions';
import type { Message } from '../../types/chat.types';

const MotionBox = motion.create(Box);
const MotionDot = motion.create(Box);

function TypingDots() {
  return (
    <HStack spacing={1}>
      {[0, 1, 2].map((i) => (
        <MotionDot
          key={i}
          w="8px"
          h="8px"
          borderRadius="full"
          bg="gray.400"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </HStack>
  );
}

interface ChatMessageProps {
  message: Message;
  onSuggestionSelect?: (value: string) => void;
}

export function ChatMessage({ message, onSuggestionSelect }: ChatMessageProps) {
  const isBot = message.role === 'bot';
  const [showContent, setShowContent] = useState(!isBot);

  useEffect(() => {
    if (isBot) {
      const timer = setTimeout(() => setShowContent(true), 700);
      return () => clearTimeout(timer);
    }
  }, [isBot]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      alignSelf={isBot ? 'flex-start' : 'flex-end'}
      maxW="85%"
    >
      <Box
        bg={isBot ? 'gray.100' : 'brand.500'}
        color={isBot ? 'gray.800' : 'white'}
        px={4}
        py={3}
        borderRadius="2xl"
        borderBottomLeftRadius={isBot ? 'md' : '2xl'}
        borderBottomRightRadius={isBot ? '2xl' : 'md'}
      >
        {showContent ? (
          <>
            <Text fontSize="md" lineHeight="tall">
              {message.content}
            </Text>
            {message.suggestions && onSuggestionSelect && (
              <Suggestions
                suggestions={message.suggestions}
                onSelect={onSuggestionSelect}
              />
            )}
          </>
        ) : (
          <TypingDots />
        )}
      </Box>
    </MotionBox>
  );
}
