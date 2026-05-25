import type { OnboardingState, OnboardingAction } from './types';

export const initialState: OnboardingState = {
  stepIndex: 0,
  name: '',
  typeId: null,
  typeLabel: '',
  phone: '',
  termsAccepted: false,
};

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, ...action.patch };
    case 'NEXT':
      return { ...state, stepIndex: state.stepIndex + 1 };
    case 'BACK':
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
    default:
      return state;
  }
}
