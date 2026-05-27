import type { Country } from 'react-phone-number-input';

const FALLBACK = (import.meta.env.VITE_DEFAULT_PHONE_COUNTRY ?? 'US') as Country;

export const DEFAULT_PHONE_COUNTRY: Country = (() => {
  if (typeof navigator === 'undefined') return FALLBACK;
  const region = (navigator.language || '').split('-')[1]?.toUpperCase();
  return (region && region.length === 2 ? region : FALLBACK) as Country;
})();
