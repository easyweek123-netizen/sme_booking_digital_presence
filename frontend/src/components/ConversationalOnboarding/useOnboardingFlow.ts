import { useReducer, useCallback, useEffect, useMemo } from 'react';
import { onboardingReducer, initialState, STEPS, type HoursPreference } from './onboardingReducer';
import {
  defaultWorkingHours,
  morningWorkingHours,
  eveningWorkingHours,
} from '../../store/slices/onboardingSlice';
import type { WorkingHours, BusinessCategory } from '../../types';
import type { Suggestion } from '@shared';

const HOURS_PRESETS: Record<HoursPreference, WorkingHours> = {
  morning: morningWorkingHours,
  standard: defaultWorkingHours,
  evening: eveningWorkingHours,
};

const TYPING_DELAY = 700;

function buildBusinessTypeSuggestions(categories: BusinessCategory[]): Suggestion[] {
  const typeSuggestions: Suggestion[] = categories.flatMap((category) =>
    (category.types ?? [])
      .filter((t) => t.isActive)
      .map((t) => ({ label: t.name, value: String(t.id) }))
  );
  return [
    ...typeSuggestions,
    { label: 'Skip', value: '', variant: 'skip' as const },
  ];
}

export function useOnboardingFlow(businessCategories: BusinessCategory[] = []) {
  const [{ stepIndex, messages, data, isTyping }, dispatch] = useReducer(onboardingReducer, initialState);

  const currentStep = STEPS[stepIndex];
  const nextStep = STEPS[stepIndex + 1];

  // Onboarding is complete when stepIndex exceeds available steps
  const onboardingComplete = stepIndex >= STEPS.length;

  // Handle typing animation delay - only runs when there's a next step to show
  useEffect(() => {
    if (isTyping && nextStep) {
      // Inject dynamic business type suggestions when the type step is next
      const suggestions = nextStep.id === 'type'
        ? buildBusinessTypeSuggestions(businessCategories)
        : nextStep.suggestions;

      const timer = setTimeout(() => {
        dispatch({
          type: 'FINISH_TYPING',
          message: {
            role: 'bot',
            content: nextStep.message.replace('{businessName}', data.businessName),
            suggestions,
          },
        });
      }, TYPING_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isTyping, data.businessName, nextStep, businessCategories]);

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

  // Compute working hours based on preference, defaulting to standard (9-5)
  const workingHours = useMemo(() => {
  const preference = data.hoursPreference;
  return preference ? HOURS_PRESETS[preference] : defaultWorkingHours;
  }, [data.hoursPreference]);

  return {
    messages,
    data,
    currentStep,
    onboardingComplete,
    isTyping,
    placeholder: currentStep?.placeholder,
    handleSubmit,
    handleSuggestionSelect,
    workingHours,
    businessTypeId: data.businessTypeId,
  };
}
