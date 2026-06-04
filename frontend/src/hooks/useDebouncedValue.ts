import { useEffect, useState } from 'react';

/**
 * Returns `value` debounced by `delayMs`. The setTimeout is cancelled
 * automatically by useEffect's cleanup when `value` changes or on unmount —
 * no manual ref tracking required.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
