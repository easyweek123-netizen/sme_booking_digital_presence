import { useToast } from '@chakra-ui/react';
import { PageLoading } from '../../ui/states';
import { ServiceForm, ServiceFormTabs, useServiceFormSession } from '../../Services';
import { DashboardTabs } from '../../Dashboard';
import { ProposalContentShell } from '../ProposalContentShell';
import { ProposalFormActions } from '../ProposalFormActions';
import { getErrorMessage } from '../../../types';
import type { ServiceFormInput } from '@bookeasy/shared';

export interface ServiceFormProposalProps {
  /** Undefined ⇒ create mode. */
  serviceId?: number;
  /** AI-proposed form values; overlaid on top of defaults + fetched service. */
  initialValues?: Partial<ServiceFormInput>;
  /** Tell ProposalCard the proposal is done (it removes + toasts). */
  onSubmit: (data: Record<string, unknown>) => Promise<void> | void;
  onCancel: () => void;
  /** Set by ProposalCard; unused here. */
  isLoading?: boolean;
}

export function ServiceFormProposal({
  serviceId, initialValues, onSubmit, onCancel,
}: ServiceFormProposalProps) {
  const isEdit = serviceId !== undefined;
  const session = useServiceFormSession(serviceId);
  const toast = useToast();
  const title = isEdit ? 'Edit Service' : 'New Service';

  if (session.isLoading) {
    return (
      <ProposalContentShell title={title}>
        <PageLoading variant="form" />
      </ProposalContentShell>
    );
  }

  return (
    <ServiceForm
      session={session}
      initialValues={initialValues}
      onSuccess={() => onSubmit({})}
      onError={(err) =>
        toast({ status: 'error', title: 'Save failed', description: getErrorMessage(err) })
      }
      onInvalid={(errors) => {
        const first = Object.values(errors)[0]?.message;
        toast({
          status: 'error',
          title: 'Check the form',
          description: typeof first === 'string' ? first : 'Some fields need attention.',
        });
      }}
    >
      {({ methods, activeTab, setActiveTab, isSaving, onSave, tabs }) => (
        <ProposalContentShell
          title={title}
          tabs={<DashboardTabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />}
          actions={
            <ProposalFormActions
              isDirty={methods.formState.isDirty || !isEdit}
              isSaving={isSaving}
              onConfirm={onSave}
              onCancel={onCancel}
              confirmLabel={isEdit ? 'Save changes' : 'Create service'}
            />
          }
        >
          <ServiceFormTabs activeTab={activeTab} />
        </ProposalContentShell>
      )}
    </ServiceForm>
  );
}
