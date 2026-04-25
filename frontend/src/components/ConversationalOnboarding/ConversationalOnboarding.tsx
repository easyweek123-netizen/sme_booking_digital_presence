import { Flex, Box, VStack, HStack, Spinner, Text, Container } from '@chakra-ui/react';
import { AllMessages, ChatInput, TypingIndicator } from '../chat';
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
  onSuggestionSelect: (value: string, label: string) => void;
  // Auth state
  isAuthenticated: boolean;
  isCreating: boolean;
  isError: boolean;
  handleAuthError: (error: unknown) => void;
}

export function ConversationalOnboarding({
  messages,
  onboardingComplete,
  isTyping,
  placeholder,
  onSubmit,
  onSuggestionSelect,
  isAuthenticated,
  isCreating,
  isError,
  handleAuthError,
}: ConversationalOnboardingProps) {
  return (
    <Flex direction="column" minH="100vh" bg="surface.page">

      <Container maxW="container.md" px={{ base: 4 }} py={{ base: 6, md: 10 }} flex={1}>

        <Box
          p={{ base: 4, md: 6 }}
          maxW="lg"
          mx="auto"
        >
          {/* Conversation */}
          <VStack
            spacing={4}
            align="stretch"
            minH={{ base: '320px', md: '380px' }}
            justify="flex-end"
            mb={4}
          >
            <AllMessages messages={messages} onSuggestionSelect={onSuggestionSelect} />
            {isTyping && <TypingIndicator />}
          </VStack>

          {/* Action area: input or auth or spinner */}
          <Box>
            {onboardingComplete ? (
              isAuthenticated && !isError ? (
                <HStack justify="center" spacing={3} py={4}>
                  <Spinner size="sm" color="accent.primary" />
                  <Text color="text.muted" fontSize="sm">
                    Creating your practice...
                  </Text>
                </HStack>
              ) : (
                <VStack spacing={3} align="stretch">
                  <Text fontSize="sm" color="text.muted" textAlign="center">
                    Sign in to finish setting up your booking page.
                  </Text>
                  <GoogleButton
                    onError={handleAuthError}
                    onSuccess={() => {}}
                    isDisabled={isCreating}
                  />
                </VStack>
              )
            ) : (
              <ChatInput placeholder={placeholder} onSubmit={onSubmit} />
            )}
          </Box>
        </Box>
      </Container>
    </Flex>
  );
  // return (
  //   <SplitLayout leftPanel={<OnboardingSteps currentStep={stepIndex} />}>
  //     <Flex direction="column" w="full" maxW="lg" h="full" py={8}>
  //       {/* Messages */}
  //       <Flex flex={3} direction="column" justify="flex-end" overflow="hidden">
  //         <VStack spacing={4} align="stretch" w="full">
  //           <AllMessages
  //             messages={messages}
  //             onSuggestionSelect={onSuggestionSelect}
  //           />
  //           {isTyping && <TypingIndicator />}
  //         </VStack>
  //       </Flex>

  //       {/* Input area */}
  //       <Box mt={6} flexShrink={0} flex={2}>
  //         {onboardingComplete ? (
  //           isAuthenticated && !isError ? (
  //             <HStack justify="center" spacing={3} py={4}>
  //               <Spinner size="sm" color="accent.primary" />
  //               <Text color="text.muted">Creating your practice...</Text>
  //             </HStack>
  //           ) : (
  //             <GoogleButton 
  //               onError={handleAuthError} 
  //               onSuccess={() => {}}
  //               isDisabled={isCreating} />
  //           )
  //         ) : (
  //           <ChatInput placeholder={placeholder} onSubmit={onSubmit} />
  //         )}
  //       </Box>
  //     </Flex>
  //   </SplitLayout>
  // );
}
