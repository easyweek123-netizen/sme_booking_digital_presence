import { useCallback, useState, type ReactNode } from 'react';
import { FormProvider, type FieldErrors, type UseFormReturn } from 'react-hook-form';
import { useSaveWebsiteForm } from './hooks/useSaveWebsiteForm';
import { WEBSITE_TABS, type WebsiteTabKey } from './websiteTabs';
import type { WebsiteFormValues } from '../../../pages/dashboard/websiteForm.types';
import type { WebsiteFormSession } from './hooks/useWebsiteFormSession';

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
  session: WebsiteFormSession;
  initialActiveTab?: WebsiteTabKey;
  onInvalid?: (errors: FieldErrors<WebsiteFormValues>) => void;
  children: (args: WebsiteFormRenderArgs) => ReactNode;
  onSuccess?: () => void | Promise<void>;
}

// Map from a form section key to its tab key. The form shape uses different
// names for the `basic` and `about` sections than the tab keys, so this is a
// 1:1 lookup not a constant.
const SECTION_TO_TAB: Record<keyof WebsiteFormValues, WebsiteTabKey> = {
  basic: 'basic',
  about: 'about',
  location: 'location',
  availability: 'availability',
};

function firstErrorTab(errors: FieldErrors<WebsiteFormValues>): WebsiteTabKey | null {
  for (const key of Object.keys(SECTION_TO_TAB) as (keyof WebsiteFormValues)[]) {
    if (errors[key]) return SECTION_TO_TAB[key];
  }
  return null;
}

export function WebsiteForm({ session, initialActiveTab = 'basic', onInvalid, onSuccess, children }: WebsiteFormProps) {
  const [activeTab, setActiveTab] = useState<WebsiteTabKey>(initialActiveTab);

  const handleInvalid = useCallback(
    (errors: FieldErrors<WebsiteFormValues>) => {
      const tab = firstErrorTab(errors);
      if (tab && tab !== activeTab) setActiveTab(tab);
      onInvalid?.(errors);
    },
    [activeTab, onInvalid],
  );

  const { methods, onSave, resetToInitial, isSaving } = useSaveWebsiteForm({
    session,
    onInvalid: handleInvalid,
    onSuccess,
  });

  return (
    <FormProvider {...methods}>
      {children({ methods, activeTab, setActiveTab, isSaving, onSave, resetToInitial, tabs: WEBSITE_TABS })}
    </FormProvider>
  );
}
