import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, logOut, onAuthStateChanged, type User } from '../lib/firebase';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import { authApi } from '../store/api/authApi';
import { toast } from '../utils/toast';
import { resetStore } from '../store/actions';

interface AuthContextType {
  firebaseUser: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
        // Get the ID token
        const token = await user.getIdToken();
        
        // Set credentials with token first (for API calls to work)
        dispatch(
          setCredentials({
            user: null,
            token,
          }),
        );

        // Fetch real user data from backend to get the correct ID
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
            description: 'Please check your inbox and verify your email before signing in.',
            status: 'warning',
            duration: 8000,
            isClosable: true,
            position: 'top',
          });
          // Backend might not be available yet, keep temporary data
        }
      }
      // Note: Store reset on logout is handled by components dispatching resetStore,
      // which triggers storeListeners to handle Firebase signout and localStorage purge
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
