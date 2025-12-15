import { useReducer, useCallback } from 'react';
import {
  onboardingReducer,
  initialState,
  STEPS,
} from './onboardingReducer';

export function useOnboardingFlow() {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const currentStep = STEPS[state.stepIndex];

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    dispatch({ type: 'SUBMIT', value: trimmed });
  }, []);

  const handleSuggestionSelect = useCallback((value: string) => {
    if (value === '') {
      dispatch({ type: 'SKIP' });
    } else {
      dispatch({ type: 'SUBMIT', value });
    }
  }, []);

  return {
    messages: state.messages,
    data: state.data,
    currentStep,
    isAuthStep: currentStep?.inputType === 'auth',
    placeholder: currentStep?.placeholder,
    handleSubmit,
    handleSuggestionSelect,
  };
}
