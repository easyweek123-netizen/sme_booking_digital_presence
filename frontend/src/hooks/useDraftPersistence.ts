import { useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export function useDraftPersistence<T extends FieldValues>(
  methods: UseFormReturn<T>,
  key: string,
): void {
  useEffect(() => {
    return () => {
      if (methods.formState.isSubmitSuccessful) return;
      try {
        sessionStorage.setItem(key, JSON.stringify(methods.getValues()));
      } catch {
        /* quota — ignore */
      }
    };
  }, [methods, key]);
}

export function readDraft<T>(key: string): T | null {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? 'null') as T | null;
  } catch {
    return null;
  }
}

export function clearStoredDraft(key: string): void {
  sessionStorage.removeItem(key);
}
