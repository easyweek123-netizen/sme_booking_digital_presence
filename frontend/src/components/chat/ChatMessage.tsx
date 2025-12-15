import { useState } from 'react';
import { Box, Text, VStack, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Suggestions } from './Suggestions';
import { ServiceFormCard } from './ServiceFormCard';
import { ServiceCard } from '../Dashboard';
import type { Message } from '../../types/chat.types';

const MotionBox = motion.create(Box);

interface ChatMessageProps {
  message: Message;
  onSuggestionSelect?: (value: string) => void;
}

export function ChatMessage({ message, onSuggestionSelect }: ChatMessageProps) {
  const isBot = message.role === 'bot';
  const [actionCompleted, setActionCompleted] = useState(false);

  const handleActionComplete = () => {
    setActionCompleted(true);
  };

  // Render action component based on type
  const renderAction = () => {
    if (!message.action || actionCompleted) return null;

    switch (message.action.type) {
      case 'service_form':
        return (
          <ServiceFormCard
            operation={message.action.operation}
            businessId={message.action.businessId}
            serviceId={message.action.serviceId}
            initialData={message.action.service}
            onComplete={handleActionComplete}
          />
        );
      case 'services_list':
        return (
          <VStack align="stretch" mt={3} spacing={3} w="full">
            {message.action.services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                showActions={false}
              />
            ))}
          </VStack>
        );
      default:
        return null;
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      alignSelf={isBot ? 'flex-start' : 'flex-end'}
      maxW="85%"
    >
      <Box
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
        background={
          !isBot
            ? 'linear-gradient(135deg, var(--chakra-colors-brand-500) 0%, var(--chakra-colors-brand-600) 100%)'
            : undefined
        }
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
      </Box>
      <Flex align="center" justify="center">
        {renderAction()}
      </Flex>
      
    </MotionBox>
  );
}
