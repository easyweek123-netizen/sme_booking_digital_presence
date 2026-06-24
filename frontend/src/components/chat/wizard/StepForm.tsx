import { useState, type ReactNode } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { stepGroup, type Group, type FieldId, type WizardStep, type WizardField } from '@shared';
import { ServiceForm, useServiceFormSession } from '../../Services';
import { WebsiteForm } from '../../Dashboard/website';
import { useWebsiteFormSession } from '../../Dashboard/website/hooks';
import { useBusiness } from '../../../contexts/business';
import { FIELD_REGISTRY } from './fieldRegistery';
import { StepFooter } from './StepFooter';

interface GroupFormProps {
  onSuccess: () => void | Promise<void>;
  children: (args: { onSave: () => void; isSaving: boolean }) => ReactNode;
}

const Loading = () => <Box px={4} py={6}><Spinner size="sm" color="accent.primary" /></Box>;

function ServiceGroupForm({ onSuccess, children }: GroupFormProps) {
  const business = useBusiness();
  const session = useServiceFormSession(business.services[0]?.id); // reopen => edit; first time => create
  if (session.isLoading) return <Loading />;
  return <ServiceForm session={session} onSuccess={onSuccess}>{children}</ServiceForm>;
}

function WebsiteGroupForm({ onSuccess, children }: GroupFormProps) {
  const session = useWebsiteFormSession();
  if (session.isLoading) return <Loading />;
  return <WebsiteForm session={session} onSuccess={onSuccess}>{children}</WebsiteForm>;
}

// Add a group = one row + one ~5-line adapter. No wasted fetches, rules-of-hooks safe.
const GROUP_FORM: Record<Group, (p: GroupFormProps) => React.JSX.Element> = {
  service: ServiceGroupForm,
  website: WebsiteGroupForm,
};

export function StepForm({
  step,
  fields,
  isLast,
  onPrev,
  onNext,
  onDone,
  onSaved,
  isSubmittingAction = false,
}: {
  step: WizardStep;
  fields: WizardField[];
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDone: () => void;
  onSaved: (stepId: string) => Promise<void>;
  isSubmittingAction?: boolean;
}) {
  const Form = GROUP_FORM[stepGroup(step)];
  return (
    <Form
      onSuccess={async () => {
        await onSaved(step.id);
        onDone();
      }}
    >
      {({ onSave, isSaving }) => {
        const isBusy = isSaving || isSubmittingAction;
        return (
          <>
            <Box px={4} py={3}>
              {fields.map((f) => {
                const Field = FIELD_REGISTRY[f.id as FieldId];
                return Field ? (
                  <Box key={f.id} mb={3}>
                    <Field />
                  </Box>
                ) : null;
              })}
            </Box>
            <StepFooter
              onBack={onPrev}
              onNext={onNext}
              onSave={onSave}
              isLast={isLast}
              saving={isBusy}
            />
          </>
        );
      }}
    </Form>
  );
}