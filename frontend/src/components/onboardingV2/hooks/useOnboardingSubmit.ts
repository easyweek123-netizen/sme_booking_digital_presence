import { useCallback } from 'react';
import { useCreateBusinessMutation } from '../../../store/api/businessApi';
import { useRegisterMutation } from '../../../store/api/authApi';
import type { OnboardingState } from '../types';
import type { User } from '../../../lib/firebase';

interface Options {
  state: OnboardingState;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export function useOnboardingSubmit({ state, onComplete, onError }: Options) {
  const [register] = useRegisterMutation();
  const [createBusiness, { isLoading: isSubmitting, isError }] =
    useCreateBusinessMutation();

  const handleAuthSuccess = useCallback(
    async (_user: User) => {
      try {
        if (!state.name.trim()) throw new Error('Business name is required');
        await register().unwrap();
        await createBusiness({
          name: state.name.trim(),
          ...(state.typeId !== null && { businessTypeId: state.typeId }),
          ...(state.phone.trim() && { phone: state.phone.trim() }),
        }).unwrap();
        onComplete();
      } catch (err) {
        onError(err as Error);
      }
    },
    [state, register, createBusiness, onComplete, onError],
  );

  return { handleAuthSuccess, isSubmitting, isError };
}
