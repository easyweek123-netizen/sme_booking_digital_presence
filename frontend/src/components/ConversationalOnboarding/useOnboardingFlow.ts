import { useReducer, useCallback, useEffect, useRef } from 'react';
import {
  onboardingReducer,
  initialState,
  STEPS,
} from './onboardingReducer';

const TYPING_DELAY = 700; // ms

export function useOnboardingFlow() {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  const pendingNextStep = useRef<boolean>(false);

  const currentStep = STEPS[state.stepIndex];
  const nextStep = STEPS[state.stepIndex + 1];

  // Handle typing animation delay
  useEffect(() => {
    if (state.isTyping && nextStep) {
      pendingNextStep.current = true;
      
      const timer = setTimeout(() => {
        dispatch({
          type: 'FINISH_TYPING',
          message: {
            role: 'bot',
            content: nextStep.message.replace('{businessName}', state.data.businessName),
            suggestions: nextStep.suggestions,
          },
        });
        pendingNextStep.current = false;
      }, TYPING_DELAY);

      return () => clearTimeout(timer);
    }
  }, [state.isTyping, state.data.businessName, nextStep]);

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed || state.isTyping) return;
    dispatch({ type: 'SUBMIT', value: trimmed });
  }, [state.isTyping]);

  const handleSuggestionSelect = useCallback((value: string) => {
    if (state.isTyping) return;
    if (value === '') {
      dispatch({ type: 'SKIP' });
    } else {
      dispatch({ type: 'SUBMIT', value });
    }
  }, [state.isTyping]);

  return {
    messages: state.messages,
    data: state.data,
    currentStep,
    isAuthStep: currentStep?.inputType === 'auth',
    isTyping: state.isTyping,
    placeholder: currentStep?.placeholder,
    handleSubmit,
    handleSuggestionSelect,
  };
}
