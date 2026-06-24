import { Box, Spinner, chakra } from '@chakra-ui/react';
import { ServiceForm, useServiceFormSession } from '../../Services';
import { useBusiness } from '../../../contexts/business';
import { SERVICE_FIELD, type ServiceCapabilityId } from './fields/ServiceFields';
import { StepFooter } from './StepFooter';
import type { StepBodyProps } from './StepForm';

export function ServiceStepForm({ step, pageFields, isLast, onPrev, onNext, onDone, onSaved }: StepBodyProps) {
  const business = useBusiness();
  const existingId = business.services[0]?.id; // reopen => edit; first time => create
  const session = useServiceFormSession(existingId);

  if (session.isLoading) {
    return <Box px={4} py={6}><Spinner size="sm" color="accent.primary" /></Box>;
  }

  return (
    <ServiceForm
      session={session}
      onSuccess={async () => { await onSaved(step.id); onDone(); }}
    >
      {({ onSave, isSaving }) => (
        <chakra.form
          onSubmit={(e) => { e.preventDefault(); if (isSaving) return; isLast ? onSave() : onNext(); }}
        >
          <Box px={4} py={3}>
            {pageFields.map((f) => (
              <Box key={f.id} mb={3}>{SERVICE_FIELD[f.id as ServiceCapabilityId]()}</Box>
            ))}
          </Box>
          <StepFooter onBack={onPrev} onNext={onNext} isLast={isLast} saving={isSaving} />
        </chakra.form>
      )}
    </ServiceForm>
  );
}