import type { FC } from 'react';
import type { User } from '../../lib/firebase';
import type { OnboardingFlow } from './hooks/useOnboardingFlow';

export interface OnboardingState {
  stepIndex: number;
  name: string;
  typeId: number | null;
  typeLabel: string;
  phone: string;
  termsAccepted: boolean;
}

export type OnboardingAction =
  | { type: 'UPDATE'; patch: Partial<OnboardingState> }
  | { type: 'NEXT' }
  | { type: 'BACK' };

export interface AuthHandlers {
  onSuccess: (user: User) => void;
  onError: (error: Error) => void;
}

export interface StepProps {
  flow: OnboardingFlow;
}

export interface OnboardingStep {
  id: string;
  title: string;
  hint: string;
  isComplete: (state: OnboardingState) => boolean;
  skipPatch?: Partial<OnboardingState>;
  hideActions?: boolean;
  Component: FC<StepProps>;
}
