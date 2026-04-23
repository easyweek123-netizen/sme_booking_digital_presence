import { createContext } from 'react';
import type { User } from '../lib/firebase';

export interface AuthContextType {
  firebaseUser: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
