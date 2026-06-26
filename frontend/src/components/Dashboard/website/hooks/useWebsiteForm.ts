import { useCallback, useMemo } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationToDraft } from '../../../Locations';
import type { BusinessWithServices, AvailabilityInput } from '../../../../types';
import { DEFAULT_BRAND_COLOR_TOKEN } from '../../../../constants/colors';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';
import { WebsiteFormSchema, type LocationDraft } from '@bookeasy/shared';
import { useToken } from '@chakra-ui/react';

function businessToFormValues(
  b: BusinessWithServices,
  availability: AvailabilityInput[],
  defaultBrandColor: string,
): WebsiteFormValues {
  return {
    basic: {
      name: b.name || '',
      description: b.description || '',
      logoUrl: b.logoUrl || '',
      brandColor: b.brandColor || defaultBrandColor,
      coverImageUrl: b.coverImageUrl || '',
      website: b.website || '',
      instagram: b.instagram || '',
    },
    about: { aboutContent: b.aboutContent || '' },
    location: {
      byType: {
        ADDRESS: (b.locations ?? [])
          .filter((l) => l.type === 'ADDRESS')
          .map((l) => locationToDraft(l))
          .filter((d): d is LocationDraft => d != null),
        PHONE: (b.locations ?? [])
          .filter((l) => l.type === 'PHONE')
          .map((l) => locationToDraft(l))
          .filter((d): d is LocationDraft => d != null),
        ONLINE: locationToDraft((b.locations ?? []).find((l) => l.type === 'ONLINE')),
      },
    },
    availability: {
      hours: availability,
      visibility: {
        showNextAvailable: b.showNextAvailable ?? true,
        showWeeklyHours: b.showWeeklyHours ?? false,
      },
    },
  };
}

interface UseWebsiteFormParams {
  business: BusinessWithServices;
  availability: AvailabilityInput[];
}

export interface UseWebsiteFormResult {
  methods: UseFormReturn<WebsiteFormValues>;
  resetToInitial: () => void;
}

export function useWebsiteForm({ business, availability }: UseWebsiteFormParams): UseWebsiteFormResult {
  const [defaultBrandColor] = useToken('colors', [DEFAULT_BRAND_COLOR_TOKEN]);
  const formValues = useMemo(
    () => businessToFormValues(business, availability, defaultBrandColor),
    [business, availability, defaultBrandColor],
  );


  const methods = useForm<WebsiteFormValues>({
    values: formValues,
    resolver: zodResolver(WebsiteFormSchema),
    mode: 'onBlur',
  });

  const resetToInitial = useCallback(() => methods.reset(formValues), [methods, formValues]);

  return { methods, resetToInitial };
}
