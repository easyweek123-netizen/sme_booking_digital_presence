import type { UseFormReturn } from 'react-hook-form';
import type { WebsiteTabKey } from '../websiteTabs';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';

export type TabStatus = Record<WebsiteTabKey, { done: number; total: number }>;

const filled = (s?: string) => !!(s && s.trim());

export function useWebsiteTabStatus(methods: UseFormReturn<WebsiteFormValues>): TabStatus {
  const v = methods.watch();
  return {
    basic: {
      done: [v.basic.name, v.basic.description, v.basic.logoUrl, v.basic.brandColor].filter(filled).length,
      total: 4,
    },
    location: { done: v.location.locations.length > 0 ? 1 : 0, total: 1 },
    availability: { done: v.availability.length > 0 ? 1 : 0, total: 1 },
    about: { done: filled(v.about.aboutContent) ? 1 : 0, total: 1 },
  };
}
