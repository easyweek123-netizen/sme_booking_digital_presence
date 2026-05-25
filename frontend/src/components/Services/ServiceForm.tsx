import { useState, type ReactNode } from 'react';
import { FormProvider, type FieldErrors, type UseFormReturn } from 'react-hook-form';
import { useSaveServiceForm } from './hooks';
import { SERVICE_TABS, type ServiceTabKey } from './serviceTabs';
import type { ServiceFormSession } from './hooks';
import type { ServiceFormInput } from '@bookeasy/shared';
import type { Service } from '../../types';

export interface ServiceFormRenderArgs {
  methods: UseFormReturn<ServiceFormInput>;
  activeTab: ServiceTabKey;
  setActiveTab: (k: ServiceTabKey) => void;
  isSaving: boolean;
  onSave: () => void;
  tabs: typeof SERVICE_TABS;
}

interface ServiceFormProps {
  session: ServiceFormSession;
  initialValues?: Partial<ServiceFormInput>;
  onSuccess: (saved: Service) => void;
  onError?: (err: unknown) => void;
  onInvalid?: (errors: FieldErrors<ServiceFormInput>) => void;
  children: (args: ServiceFormRenderArgs) => ReactNode;
}

export function ServiceForm({
  session,
  initialValues,
  onSuccess,
  onError,
  onInvalid,
  children,
}: ServiceFormProps) {
  const [activeTab, setActiveTab] = useState<ServiceTabKey>('basic');
  const { methods, onSave, isSaving } = useSaveServiceForm({
    session,
    initialValues,
    onSuccess,
    onError,
    onInvalid,
  });

  return (
    <FormProvider {...methods}>
      {children({ methods, activeTab, setActiveTab, isSaving, onSave, tabs: SERVICE_TABS })}
    </FormProvider>
  );
}
