import { useCallback, useMemo } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { locationToDraft } from '../../../Locations';
import type { LocationDraft } from '@bookeasy/shared';
import type { BusinessWithServices, AvailabilityInput } from '../../../../types';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';

function businessToFormValues(
  b: BusinessWithServices,
  availability: AvailabilityInput[],
): WebsiteFormValues {
  return {
    basic: {
      name: b.name || '',
      description: b.description || '',
      logoUrl: b.logoUrl || '',
      brandColor: b.brandColor || '',
      coverImageUrl: b.coverImageUrl || '',
      website: b.website || '',
      instagram: b.instagram || '',
    },
    about: { aboutContent: b.aboutContent || '' },
    location: {
      locations: (b.locations ?? [])
        .map((l) => locationToDraft(l))
        .filter((d): d is LocationDraft => d != null),
    },
    availability,
    workingHoursVisibilityOnBookingPage: {
      showNextAvailable: b.showNextAvailable ?? true,
      showWeeklyHours: b.showWeeklyHours ?? true,
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
  const formValues = useMemo(
    () => businessToFormValues(business, availability),
    [business, availability],
  );

  const methods = useForm<WebsiteFormValues>({
    values: formValues,
    resetOptions: { keepDirtyValues: true },
    mode: 'onBlur',
  });

  const resetToInitial = useCallback(() => methods.reset(formValues), [methods, formValues]);

  return { methods, resetToInitial };
}
