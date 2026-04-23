import { Box, Text, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ReactMarkdown, { type Components } from 'react-markdown';
import { Suggestions } from './Suggestions';
import type { Message } from '../../types/chat.types';

const MotionBox = motion.create(Box);

const markdownComponents: Components = {
  p: (props) => (
    <Text fontSize="sm" lineHeight="tall" mb={1} _last={{ mb: 0 }} {...props} />
  ),
  strong: (props) => <Text as="span" fontWeight="600" {...props} />,
  em: (props) => <Text as="span" fontStyle="italic" {...props} />,
  h3: (props) => (
    <Text fontSize="sm" fontWeight="700" mt={2} mb={1} {...props} />
  ),
  h4: (props) => (
    <Text fontSize="sm" fontWeight="600" mt={2} mb={1} {...props} />
  ),
  ul: (props) => <Box as="ul" pl={4} mb={1} fontSize="sm" {...props} />,
  ol: (props) => <Box as="ol" pl={4} mb={1} fontSize="sm" {...props} />,
  li: (props) => (
    <Box as="li" fontSize="sm" lineHeight="tall" {...props} />
  ),
  a: (props) => (
    <Link color="brand.500" textDecoration="underline" isExternal {...props} />
  ),
};

interface ChatMessageProps {
  message: Message;
  onSuggestionSelect?: (value: string, label: string) => void;
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
    >
      <Box
        bg={isBot ? 'surface.card' : 'brand.500'}
        px={4}
        py={2}
        borderRadius="2xl"
        borderTopLeftRadius={isBot ? 'lg' : '2xl'}
        borderTopRightRadius={isBot ? '2xl' : 'lg'}
        boxShadow={isBot ? 'sm' : 'md'}
      >
        {isBot ? (
          <ReactMarkdown components={markdownComponents}>
            {message.content}
          </ReactMarkdown>
        ) : (
          <Text color="surface.card" lineHeight="tall" whiteSpace="pre-wrap">
            {message.content}
          </Text>
        )}
        {message.suggestions && onSuggestionSelect && (
          <Suggestions
            suggestions={message.suggestions}
            onSelect={onSuggestionSelect}
          />
        )}
      </Box>
    </MotionBox>
  );
}
