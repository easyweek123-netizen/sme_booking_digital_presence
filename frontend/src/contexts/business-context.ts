import { createContext } from 'react';
import type { BusinessWithServices } from '../types';

export interface BusinessContextType {
  business: BusinessWithServices | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export const BusinessContext = createContext<BusinessContextType | null>(null);
