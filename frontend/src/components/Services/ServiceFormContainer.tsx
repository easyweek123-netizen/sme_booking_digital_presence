import { useBreakpointValue } from '@chakra-ui/react';
import type { FieldErrors } from 'react-hook-form';
import { DashboardContentShell, DashboardFormActions, DashboardTabs } from '../Dashboard';
import { ROUTES } from '../../config/routes';
import { ServiceForm } from './ServiceForm';
import { ServiceFormDesktop } from './ServiceFormDesktop';
import { ServiceFormMobile } from './ServiceFormMobile';
import type { ServiceFormSession } from './hooks';
import type { ServiceFormInput } from '@bookeasy/shared';
import type { Service } from '../../types';

interface ServiceFormContainerProps {
  isEdit: boolean;
  session: ServiceFormSession;
  onSuccess: (saved: Service) => void;
  onError: (err: unknown) => void;
  onInvalid: (errors: FieldErrors<ServiceFormInput>) => void;
}

export function ServiceFormContainer({
  isEdit, session, onSuccess, onError, onInvalid,
}: ServiceFormContainerProps) {
  const isDesktop = useBreakpointValue({ base: false, lg: true }, { ssr: false });
  const Layout = isDesktop ? ServiceFormDesktop : ServiceFormMobile;

  return (
    <ServiceForm
      session={session}
      onSuccess={onSuccess}
      onError={onError}
      onInvalid={onInvalid}
    >
      {({ methods, activeTab, setActiveTab, isSaving, onSave, clearDraft, tabs }) => (
        <DashboardContentShell
          title={session.service?.name ?? 'New service'}
          backHref={ROUTES.DASHBOARD.SERVICES}
          onBackClick={clearDraft}
          bodyOverflow={isDesktop ? 'auto' : 'hidden'}
          tabs={<DashboardTabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />}
          actions={
            <DashboardFormActions
              isDirty={methods.formState.isDirty}
              isSaving={isSaving}
              onSave={onSave}
              onDiscard={() => {
                methods.reset();
                clearDraft();
              }}
              saveLabel={isEdit ? 'Save changes' : 'Create service'}
            />
          }
        >
          <Layout activeTab={activeTab} isEdit={isEdit} />
        </DashboardContentShell>
      )}
    </ServiceForm>
  );
}
