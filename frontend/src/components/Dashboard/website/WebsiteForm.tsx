import { useState, type ReactNode } from 'react';
import { FormProvider, type FieldErrors, type UseFormReturn } from 'react-hook-form';
import { useWebsiteForm } from './hooks';
import { useSaveWebsiteForm } from './hooks/useSaveWebsiteForm';
import { WEBSITE_TABS, type WebsiteTabKey } from './websiteTabs';
import type { BusinessWithServices, AvailabilityInput } from '../../../types';
import type { WebsiteFormValues } from '../../../pages/dashboard/websiteForm.types';

export interface WebsiteFormRenderArgs {
  methods: UseFormReturn<WebsiteFormValues>;
  activeTab: WebsiteTabKey;
  setActiveTab: (k: WebsiteTabKey) => void;
  isSaving: boolean;
  onSave: () => void;
  resetToInitial: () => void;
  tabs: typeof WEBSITE_TABS;
}

interface WebsiteFormProps {
  business: BusinessWithServices;
  initialAvailability: AvailabilityInput[];
  initialActiveTab?: WebsiteTabKey;
  onInvalid?: (errors: FieldErrors<WebsiteFormValues>) => void;
  children: (args: WebsiteFormRenderArgs) => ReactNode;
}

export function WebsiteForm({
  business,
  initialAvailability,
  initialActiveTab = 'basic',
  onInvalid,
  children,
}: WebsiteFormProps) {
  const [activeTab, setActiveTab] = useState<WebsiteTabKey>(initialActiveTab);
  const { methods, resetToInitial } = useWebsiteForm({ business, availability: initialAvailability });
  const { onSave, isSaving } = useSaveWebsiteForm({ business, methods, onInvalid });

  return (
    <FormProvider {...methods}>
      {children({
        methods, activeTab, setActiveTab,
        isSaving, onSave, resetToInitial,
        tabs: WEBSITE_TABS,
      })}
    </FormProvider>
  );
}
