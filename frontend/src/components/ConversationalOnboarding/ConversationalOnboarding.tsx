import { Flex, Box } from '@chakra-ui/react';
import { SplitLayout } from '../Layout';
import { AllMessages, ChatInput } from '../chat';
import { OnboardingSteps } from './OnboardingSteps';
import { GoogleButton } from '../../lib/auth';
import { useOnboardingFlow } from './useOnboardingFlow';

export interface OnboardingData {
  businessName: string;
  category: string | null;
}

interface ConversationalOnboardingProps {
  onAuth: (data: OnboardingData) => void;
  isAuthLoading?: boolean;
}

export function ConversationalOnboarding({
  onAuth,
  isAuthLoading = false,
}: ConversationalOnboardingProps) {
  const {
    messages,
    data,
    currentStep,
    isAuthStep,
    placeholder,
    handleSubmit,
    handleSuggestionSelect,
  } = useOnboardingFlow();

  const stepIndex = currentStep
    ? ['name', 'category', 'auth'].indexOf(currentStep.id)
    : 0;

  const handleAuthClick = () => {
    onAuth(data);
  };

  return (
    <SplitLayout leftPanel={<OnboardingSteps currentStep={stepIndex} />}>
      <Flex
        direction="column"
        w="full"
        maxW="lg"
        h="full"
        py={8}
      >
        {/* Messages - grows and aligns content to bottom */}
        <Flex flex={3} direction="column" justify="flex-end" overflow="hidden">
          <AllMessages
            messages={messages}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </Flex>

        {/* Input area - stays at bottom */}
        <Box mt={6} flexShrink={0} flex={2}>
          {isAuthStep ? (
            <GoogleButton
              onSuccess={handleAuthClick}
              isDisabled={isAuthLoading}
            />
          ) : (
            <ChatInput
              placeholder={placeholder}
              onSubmit={handleSubmit}
            />
          )}
        </Box>
      </Flex>
    </SplitLayout>
  );
}
