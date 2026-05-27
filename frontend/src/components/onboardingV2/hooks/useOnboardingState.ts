import { useCallback, useReducer } from 'react';
import { onboardingReducer, initialState } from '../onboardingReducer';
import type { OnboardingState } from '../types';

export function useOnboardingState() {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const update = useCallback(
    (patch: Partial<OnboardingState>) => dispatch({ type: 'UPDATE', patch }),
    [],
  );
  const next = useCallback(() => dispatch({ type: 'NEXT' }), []);
  const back = useCallback(() => dispatch({ type: 'BACK' }), []);
  const skipWith = useCallback((patch: Partial<OnboardingState>) => {
    dispatch({ type: 'UPDATE', patch });
    dispatch({ type: 'NEXT' });
  }, []);

  return { state, update, next, back, skipWith };
}
