import { Flex, Box, VStack, HStack, Spinner, Text } from '@chakra-ui/react';
import { SplitLayout } from '../Layout';
import { AllMessages, ChatInput, TypingIndicator } from '../chat';
import { OnboardingSteps } from './OnboardingSteps';
import { GoogleButton } from '../../lib/auth';
import type { Message } from '../../types/chat.types';
import type { Step } from './onboardingReducer';

interface ConversationalOnboardingProps {
  // State from hook
  messages: Message[];
  currentStep: Step | undefined;
  onboardingComplete: boolean;
  isTyping: boolean;
  placeholder?: string;
  // Handlers
  onSubmit: (value: string) => void;
  onSuggestionSelect: (value: string) => void;
  onCreateBusiness: () => void;
  // Auth state
  isAuthenticated: boolean;
  isCreating: boolean;
}

export function ConversationalOnboarding({
  messages,
  currentStep,
  onboardingComplete,
  isTyping,
  placeholder,
  onSubmit,
  onSuggestionSelect,
  onCreateBusiness,
  isAuthenticated,
  isCreating,
}: ConversationalOnboardingProps) {
  // Step indicator: 0=name, 1=category, 2=complete/auth
  const stepIndex = currentStep ? (currentStep.id === 'name' ? 0 : 1) : 2;

  return (
    <SplitLayout leftPanel={<OnboardingSteps currentStep={stepIndex} />}>
      <Flex direction="column" w="full" maxW="lg" h="full" py={8}>
        {/* Messages */}
        <Flex flex={3} direction="column" justify="flex-end" overflow="hidden">
          <VStack spacing={4} align="stretch" w="full">
            <AllMessages
              messages={messages}
              onSuggestionSelect={onSuggestionSelect}
            />
            {isTyping && <TypingIndicator />}
          </VStack>
        </Flex>

        {/* Input area */}
        <Box mt={6} flexShrink={0} flex={2}>
          {onboardingComplete ? (
            isAuthenticated ? (
              <HStack justify="center" spacing={3} py={4}>
                <Spinner size="sm" color="brand.500" />
                <Text color="gray.500">Creating your practice...</Text>
              </HStack>
            ) : (
              <GoogleButton onSuccess={onCreateBusiness} isDisabled={isCreating} />
            )
          ) : (
            <ChatInput placeholder={placeholder} onSubmit={onSubmit} />
          )}
        </Box>
      </Flex>
    </SplitLayout>
  );
}
