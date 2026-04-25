import { useContext } from 'react';
import { BusinessContext, type BusinessContextType } from './business-context';
import type { BusinessWithServices } from '../types';

export function useBusinessOptional(): BusinessContextType {
  const ctx = useContext(BusinessContext);
  if (!ctx) {
    throw new Error('useBusinessOptional must be used within <BusinessProvider>');
  }
  return ctx;
}

export function useBusiness(): BusinessWithServices {
  const { business } = useBusinessOptional();
  if (!business) {
    throw new Error(
      'useBusiness called before business loaded. Wrap consumers in <BusinessGate>.',
    );
  }
  return business;
}
