import type { FieldErrors } from 'react-hook-form';
import type { ServiceFormInput } from '@bookeasy/shared';
import type { Service } from '../../../types';
import { useServiceForm } from './useServiceForm';
import { useSaveService } from './useSaveService';
import type { ServiceFormSession } from './useServiceFormSession';

interface UseSaveServiceFormParams {
  session: ServiceFormSession;
  initialValues?: Partial<ServiceFormInput>;
  onSuccess?: (saved: Service) => void;
  onError?: (err: unknown) => void;
  onInvalid?: (errors: FieldErrors<ServiceFormInput>) => void;
}

export function useSaveServiceForm({
  session,
  initialValues,
  onSuccess,
  onError,
  onInvalid,
}: UseSaveServiceFormParams) {
  const methods = useServiceForm({
    service: session.service,
    business: session.business,
    availability: session.availability,
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
        onSuccess?.(saved);
      } catch (err) {
        onError?.(err);
        throw err;
      }
    },
    (errors) => onInvalid?.(errors),
  );

  return { methods, onSave, isSaving } as const;
}
