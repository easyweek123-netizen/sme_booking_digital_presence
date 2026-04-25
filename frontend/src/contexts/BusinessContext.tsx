import { useMemo, type ReactNode } from 'react';
import { useGetMyBusinessQuery } from '../store/api/businessApi';
import { BusinessContext, type BusinessContextType } from './business-context';

interface BusinessProviderProps {
  children: ReactNode;
}

export function BusinessProvider({ children }: BusinessProviderProps) {
  const { data: business, isLoading, error, refetch } = useGetMyBusinessQuery();

  const value = useMemo<BusinessContextType>(
    () => ({
      business: business ?? null,
      isLoading,
      error,
      refetch,
    }),
    [business, isLoading, error, refetch],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}
