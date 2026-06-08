import type { FieldErrors } from 'react-hook-form';
import type { ServiceFormInput } from '@bookeasy/shared';
import type { Service } from '../../../types';
import { useServiceForm } from './useServiceForm';
import { useSaveService, InvalidLocationError } from './useSaveService';
import { InvalidCreatingLocationError } from '../../Locations';
import type { ServiceFormSession } from './useServiceFormSession';

interface Params {
  session: ServiceFormSession;
  initialValues?: Partial<ServiceFormInput>;
  onSuccess?: (saved: Service) => void;
  onError?: (err: unknown) => void;
  onInvalid?: (errors: FieldErrors<ServiceFormInput>) => void;
}

export function useSaveServiceForm({
  session, initialValues, onSuccess, onError, onInvalid,
}: Params) {
  const { methods, clearDraft } = useServiceForm({
    service: session.service,
    business: session.business,
    availability: session.availability,
    location: session.location,
    initialValues,
  });

  const [saveService, { isSaving }] = useSaveService({
    service: session.service,
    business: session.business,
    initialAvailability: session.availability,
  });

  const onSave = methods.handleSubmit(
    async (values) => {
      try {
        const saved = await saveService(values);
        clearDraft();
        onSuccess?.(saved);
      } catch (err) {
        if (err instanceof InvalidCreatingLocationError) {
          methods.setError('location', { type: 'manual', message: err.message });
          return;
        }
        if (err instanceof InvalidLocationError) {
          methods.setError('location', { type: 'required', message: err.message });
          return;
        }
        onError?.(err);
        throw err;
      }
    },
    (errors) => onInvalid?.(errors),
  );

  return { methods, onSave, isSaving, clearDraft } as const;
}
