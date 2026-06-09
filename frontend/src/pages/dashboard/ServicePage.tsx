import { useBreakpointValue, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLoading } from '../../components/ui/states';
import { ServiceForm, useServiceFormSession, type ServiceTabKey } from '../../components/Services';
import { ROUTES } from '../../config/routes';
import { getErrorMessage } from '../../types';
import { DashboardContentShell } from '@/components/Dashboard/DashboardContentShell';
import { ServiceFormDesktop } from '@/components/Services/ServiceFormDesktop';
import { ServiceFormMobile } from '@/components/Services/ServiceFormMobile';
import type { FieldErrors } from 'react-hook-form';
import type { ServiceFormInput } from '@shared/schemas/service.schema';
import { DashboardFormActions, DashboardTabs } from '@/components/Dashboard';

interface ServicePageProps {
  isEdit: boolean;
}

export function ServicePage({ isEdit }: ServicePageProps) {
  const { id } = useParams<{ id: string }>();
  const serviceId = isEdit ? Number(id) : undefined;
  const navigate = useNavigate();
  const toast = useToast();
  const isDesktop = useBreakpointValue({ base: false, lg: true }, { ssr: false });
  const Layout = isDesktop ? ServiceFormDesktop : ServiceFormMobile;


  const session = useServiceFormSession(serviceId);
  if (session.isLoading) return <PageLoading variant="form" />;

  const initialActiveTab: ServiceTabKey =
    isEdit && session.service?.locationId == null ? 'location' : 'basic';

  const onSuccess= () => {
    toast({ status: 'success', title: isEdit ? 'Service updated' : 'Service created' });
    navigate(ROUTES.DASHBOARD.SERVICES);
  }

  const onError = (err: unknown) =>
    toast({ status: 'error', title: 'Save failed', description: getErrorMessage(err) })

  const onInvalid = (errors: FieldErrors<ServiceFormInput>) => {
    const first = Object.values(errors)[0]?.message;
    toast({
      status: 'error',
      title: 'Check the form',
      description: typeof first === 'string' ? first : 'Some fields need attention.',
    });
  }

  return (
    <ServiceForm
      session={session}
      initialActiveTab={initialActiveTab}
      onSuccess={onSuccess}
      onError={onError}
      onInvalid={onInvalid}
    >
      {({ methods, activeTab, setActiveTab, isSaving, onSave, tabs }) => (
        <DashboardContentShell
          title={session.service?.name ?? 'New service'}
          backHref={ROUTES.DASHBOARD.SERVICES}
          bodyOverflow={isDesktop ? 'auto' : 'hidden'}
          tabs={<DashboardTabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />}
          actions={
            <DashboardFormActions
              isDirty={methods.formState.isDirty}
              isSaving={isSaving}
              onSave={onSave}
              onDiscard={() => methods.reset()}
              saveLabel={isEdit ? 'Save changes' : 'Create service'}
            />
          }
        >
          <Layout activeTab={activeTab} isEdit={isEdit} />
        </DashboardContentShell>
      )}
    </ServiceForm>
  )
}

export default ServicePage;
