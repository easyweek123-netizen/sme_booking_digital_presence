import { Button, HStack } from '@chakra-ui/react';

export interface OnboardingActionsProps {
  canContinue: boolean;
  isLoading?: boolean;
  onContinue: () => void;
  onSkip?: () => void;
  skipDisabled?: boolean;
  continueLabel?: string;
}

export function OnboardingActions({
  canContinue,
  isLoading = false,
  onContinue,
  onSkip,
  skipDisabled = false,
  continueLabel = 'Continue',
}: OnboardingActionsProps) {
  return (
    <HStack spacing={2} flexShrink={0}>
      {onSkip && (
        <Button
          variant="ghost"
          size="sm"
          color="whiteAlpha.700"
          onClick={onSkip}
          isDisabled={skipDisabled}
          _hover={{ bg: 'whiteAlpha.100' }}
        >
          Skip
        </Button>
      )}
      <Button
        size="sm"
        bg="white"
        color="black"
        borderRadius="full"
        px={6}
        onClick={onContinue}
        isDisabled={!canContinue}
        isLoading={isLoading}
        _hover={{ bg: 'gray.200' }}
      >
        {continueLabel}
      </Button>
    </HStack>
  );
}
