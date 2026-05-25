import { useOnboardingState } from './useOnboardingState';
import { useOnboardingSubmit } from './useOnboardingSubmit';
import type { AuthHandlers } from '../types';

interface Options {
  onComplete: () => void;
  onError: (error: Error) => void;
}

export function useOnboardingFlow({ onComplete, onError }: Options) {
  const { state, update, next, back, skipWith } = useOnboardingState();
  const { handleAuthSuccess, isSubmitting, isError } = useOnboardingSubmit({
    state, onComplete, onError,
  });

  const auth: AuthHandlers = { onSuccess: handleAuthSuccess, onError };

  return { state, update, next, back, skipWith, auth, isSubmitting, isError };
}

export type OnboardingFlow = ReturnType<typeof useOnboardingFlow>;
