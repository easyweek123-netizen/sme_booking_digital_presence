import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import { websitePreviewDraft, type BusinessPreviewShape } from '../preview/helpers';
import type { BusinessWithServices } from '../../../../types';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';

const PREVIEW_DEBOUNCE_MS = 200;

export function useWebsiteFormDraft(saved: BusinessWithServices): BusinessPreviewShape {
  const { control } = useFormContext<WebsiteFormValues>();
  const values = useWatch({ control }) as WebsiteFormValues | undefined;
  const debounced = useDebouncedValue(values, PREVIEW_DEBOUNCE_MS);
  return useMemo(() => websitePreviewDraft(debounced, saved), [debounced, saved]);
}
