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
          onClick={onSkip}
          isDisabled={skipDisabled}
        >
          Skip
        </Button>
      )}
      <Button
        variant="accent"
        size="sm"
        borderRadius="full"
        px={6}
        onClick={onContinue}
        isDisabled={!canContinue}
        isLoading={isLoading}
      >
        {continueLabel}
      </Button>
    </HStack>
  );
}
