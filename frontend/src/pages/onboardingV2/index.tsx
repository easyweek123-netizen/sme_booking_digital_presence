import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import {
  Onboarding,
  useOnboardingFlow,
  BusinessFields,
  TypeFields,
  AccountFields,
  type OnboardingStep,
} from '../../components/onboardingV2';
import { ROUTES } from '../../config/routes';
import { TOAST_DURATION } from '../../constants';

const STEPS: OnboardingStep[] = [
  {
    id: 'business',
    title: "What's your business called?",
    hint: 'This is the name your customers will see when they book with you.',
    isComplete: (s) => s.name.trim().length > 0,
    Component: BusinessFields,
  },
  {
    id: 'type',
    title: 'What kind of business?',
    hint: 'Pick the closest match — you can change it later.',
    isComplete: (s) => s.typeId !== null,
    skipPatch: { typeId: null, typeLabel: '' },
    Component: TypeFields,
  },
  {
    id: 'account',
    title: 'Create your account',
    hint: 'Sign in to finish setting up your booking page.',
    isComplete: (s) => s.termsAccepted,
    hideActions: true,
    Component: AccountFields,
  },
];

export function OnboardingV2Page() {
  const navigate = useNavigate();
  const toast = useToast();

  const onComplete = useCallback(
    () => navigate(ROUTES.DASHBOARD.CANVAS, { state: { fromOnboarding: true } }),
    [navigate],
  );

  const onError = useCallback(
    (error: Error) => {
      toast({
        title: 'Authentication failed',
        description: error.message,
        status: 'error',
        duration: TOAST_DURATION.LONG,
        isClosable: true,
      });
    },
    [toast],
  );

  const flow = useOnboardingFlow({ onComplete, onError });

  return <Onboarding flow={flow} steps={STEPS} />;
}
