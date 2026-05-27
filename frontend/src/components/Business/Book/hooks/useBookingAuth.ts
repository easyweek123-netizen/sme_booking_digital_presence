import { useMemo } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { useAuth } from '../../../../contexts/useAuth';

export interface BookingAuth {
  isAuthenticated: boolean;
  userEmail: string | null;
  customerName: string;
  customerEmail: string;
}

/**
 * Resolves the customer identity used by the public booking wizard.
 *
 * Prefers the DB-backed Redux `auth.user` (populated by `/auth/me` after
 * sign-in). Falls back to the live Firebase identity while `/auth/me` is
 * still in flight so the user can submit immediately after the Google
 * popup resolves.
 */
export function useBookingAuth(): BookingAuth {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authUser = useAppSelector((s) => s.auth.user);
  const { firebaseUser } = useAuth();

  return useMemo(() => {
    const userEmail = authUser?.email ?? firebaseUser?.email ?? null;
    const customerName =
      authUser?.name?.trim() ||
      firebaseUser?.displayName?.trim() ||
      userEmail?.split('@')[0] ||
      'Customer';
    const customerEmail = userEmail ?? '';
    return { isAuthenticated, userEmail, customerName, customerEmail };
  }, [isAuthenticated, authUser, firebaseUser]);
}
