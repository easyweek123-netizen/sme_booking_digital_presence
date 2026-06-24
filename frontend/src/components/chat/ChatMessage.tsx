import { Box, Text, Link } from "@chakra-ui/react";
import { MotionBox } from "../ui/MotionBox";
import { Suggestions } from "./Suggestions";
import type { Message } from "@shared";
import ReactMarkdown, { type Components } from "react-markdown";
import { ChatCards } from "./cards/ChatCards";

const markdownComponents: Components = {
  p: ({ node, ref, ...props }) => (
    <Text color="text.primary" fontSize="sm" lineHeight="tall" mb={1} _last={{ mb: 0 }} {...props} />
  ),
  strong: ({ node, ref, ...props }) => (
    <Text as="span" color="text.heading" fontWeight="600" {...props} />
  ),
  em: ({ node, ref, ...props }) => (
    <Text as="span" fontStyle="italic" {...props} />
  ),
  h3: ({ node, ref, ...props }) => (
    <Text fontSize="sm" color="text.heading" fontWeight="700" mt={2} mb={1} {...props} />
  ),
  h4: ({ node, ref, ...props }) => (
    <Text fontSize="sm" color="text.heading" fontWeight="600" mt={2} mb={1} {...props} />
  ),
  ul: ({ node, ref, ...props }) => (
    <Box as="ul" pl={4} mb={1} fontSize="sm" {...props} />
  ),
  ol: ({ node, ref, ...props }) => (
    <Box as="ol" pl={4} mb={1} fontSize="sm" {...props} />
  ),
  li: ({ node, ref, ...props }) => (
    <Box as="li" fontSize="sm" lineHeight="tall" {...props} />
  ),
  a: ({ node, ref, ...props }) => (
    <Link color="accent.primary" textDecoration="underline" isExternal {...props} />
  ),
};

interface ChatMessageProps {
  message: Message;
  onSuggestionSelect?: (value: string, label?: string) => void;
}

export function ChatMessage({ message, onSuggestionSelect }: ChatMessageProps) {
  const isBot = message.role === 'bot';
  const hasContent = message.content.trim().length > 0;
  const hasCards = isBot && !!message.cards?.length;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      alignSelf={isBot ? 'flex-start' : 'flex-end'}
      maxW={hasCards ? '100%' : '85%'} w={hasCards ? 'full' : undefined}
    >
      {(hasContent || !isBot) && (
        <Box bg={isBot ? 'surface.card' : 'accent.primary'} px={4} py={2} borderRadius="2xl"
          borderTopLeftRadius={isBot ? 'lg' : '2xl'} borderTopRightRadius={isBot ? '2xl' : 'lg'}
          boxShadow={isBot ? 'sm' : 'md'}>
          {isBot
            ? <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
            : <Text color="surface.card" fontSize="sm">{message.content}</Text>}
          {message.suggestions && onSuggestionSelect && (
            <Suggestions suggestions={message.suggestions} onSelect={onSuggestionSelect} />
          )}
        </Box>
      )}
      {hasCards && <ChatCards cards={message.cards!} />}
    </MotionBox>
  );
}