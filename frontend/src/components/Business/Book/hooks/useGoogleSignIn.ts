import { useCallback, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { signInWithGoogle } from '../../../../lib/firebase';
import { TOAST_DURATION } from '../../../../constants';

export interface GoogleSignIn {
  signingIn: boolean;
  signIn: () => Promise<void>;
}

/**
 * Wraps Firebase Google popup sign-in with a loading flag and an
 * error toast. The `AuthProvider`'s `onAuthStateChanged` listener
 * is what actually populates Redux on success — this hook stays
 * focused on the UX of the popup.
 */
export function useGoogleSignIn(): GoogleSignIn {
  const toast = useToast();
  const [signingIn, setSigningIn] = useState(false);

  const signIn = useCallback(async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: 'Sign-in failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: TOAST_DURATION.LONG,
        isClosable: true,
      });
    } finally {
      setSigningIn(false);
    }
  }, [signingIn, toast]);

  return { signingIn, signIn };
}
