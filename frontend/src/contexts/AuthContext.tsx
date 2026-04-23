import { useEffect, useState, type ReactNode } from 'react';
import { auth, logOut, onAuthStateChanged, type User } from '../lib/firebase';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import { authApi } from '../store/api/authApi';
import { toast } from '../utils/toast';
import { resetStore } from '../store/actions';
import { AuthContext } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        const token = await user.getIdToken();

        dispatch(
          setCredentials({
            user: null,
            token,
          }),
        );

        try {
          const result = await dispatch(authApi.endpoints.getMe.initiate()).unwrap();
          dispatch(
            setCredentials({
              user: result,
              token,
            }),
          );
        } catch {
          await logOut();
          dispatch(resetStore());
          toast({
            title: 'Email not verified',
            description:
              'Please check your inbox and verify your email before signing in.',
            status: 'warning',
            duration: 8000,
            isClosable: true,
            position: 'top',
          });
        }
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ firebaseUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
