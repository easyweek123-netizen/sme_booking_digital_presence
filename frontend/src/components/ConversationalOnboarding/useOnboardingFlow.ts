import { useReducer, useCallback, useEffect } from 'react';
import { onboardingReducer, initialState, STEPS } from './onboardingReducer';

const TYPING_DELAY = 700;

export function useOnboardingFlow() {
  const [{ stepIndex, messages, data, isTyping }, dispatch] = useReducer(onboardingReducer, initialState);

  const currentStep = STEPS[stepIndex];
  const nextStep = STEPS[stepIndex + 1];
  
  // Onboarding is complete when stepIndex exceeds available steps
  const onboardingComplete = stepIndex >= STEPS.length;

  // Handle typing animation delay - only runs when there's a next step to show
  useEffect(() => {
    if (isTyping && nextStep) {
      const timer = setTimeout(() => {
        dispatch({
          type: 'FINISH_TYPING',
          message: {
            role: 'bot',
            content: nextStep.message.replace('{businessName}', data.businessName),
            suggestions: nextStep.suggestions,
          },
        });
      }, TYPING_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isTyping, data.businessName, nextStep]);

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isTyping) return;
    dispatch({ type: 'SUBMIT', value: trimmed });
  }, [isTyping]);

  const handleSuggestionSelect = useCallback((value: string) => {
    if (isTyping) return;
    if (value === '') {
      dispatch({ type: 'SKIP' });
    } else {
      dispatch({ type: 'SUBMIT', value });
    }
  }, [isTyping]);

  return {
    messages,
    data,
    currentStep,
    onboardingComplete,
    isTyping,
    placeholder: currentStep?.placeholder,
    handleSubmit,
    handleSuggestionSelect,
  };
}
