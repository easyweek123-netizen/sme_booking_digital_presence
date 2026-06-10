import type { AddressLocation, OnlineLocation } from '../../../types/location';

export function formatAddressLines(a: AddressLocation): { primary: string; secondary: string } {
  const cityLine = [a.postalCode, a.city].filter(Boolean).join(' ');
  return { primary: a.line1, secondary: [a.line2, cityLine].filter(Boolean).join(' · ') };
}

export function formatPhoneTel(phone: string): string {
  return phone.replace(/\s+/g, '');
}

export function onlineProviderLabel(_l: OnlineLocation): string {
  return 'Online meeting link';
}
