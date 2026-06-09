import { useToast } from '@chakra-ui/react';
import type { FieldErrors } from 'react-hook-form';
import { useUpdateBusinessMutation } from '../../../../store/api/businessApi';
import { useUpdateScheduleMutation } from '../../../../store/api/schedulesApi';
import { useSaveBusinessLocations } from './useSaveBusinessLocations';
import { useWebsiteForm } from './useWebsiteForm';
import { TOAST_DURATION } from '../../../../constants';
import { getErrorMessage } from '../../../../types';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';
import type { WebsiteFormSession } from './useWebsiteFormSession';

interface Params {
  session: WebsiteFormSession;
  onInvalid?: (errors: FieldErrors<WebsiteFormValues>) => void;
}

export function useSaveWebsiteForm({ session, onInvalid }: Params) {
  const toast = useToast();
  const { methods, resetToInitial } = useWebsiteForm({
    business: session.business,
    availability: session.availability,
  });
  const [updateBusiness, { isLoading: isUpdatingBusiness }] = useUpdateBusinessMutation();
  const [updateSchedule, { isLoading: isUpdatingSchedule }] = useUpdateScheduleMutation();
  const saveLocations = useSaveBusinessLocations();

  const onSave = methods.handleSubmit(
    async (values) => {
      const { dirtyFields } = methods.formState;
      try {
        const ops: Promise<unknown>[] = [];

        if (dirtyFields.basic || dirtyFields.about || dirtyFields.availability?.visibility) {
          ops.push(
            updateBusiness({
              ...values.basic,
              ...values.about,
              ...values.availability.visibility,
            }).unwrap(),
          );
        }

        if (dirtyFields.availability?.hours) {
          ops.push(
            updateSchedule({
              id: session.business.defaultScheduleId,
              data: { availability: values.availability.hours },
            }).unwrap(),
          );
        }

        saveLocations.save(
          {
            ADDRESS: values.location.byType.ADDRESS ?? [],
            PHONE: values.location.byType.PHONE ?? [],
            ONLINE: values.location.byType.ONLINE,
          },
          session.business.locations ?? [],
        );
        await Promise.all(ops);
        toast({ title: 'Website saved', status: 'success', duration: TOAST_DURATION.MEDIUM });
      } catch (err) {
        const data = (err as { data?: { code?: string; message?: string } }).data;
        if (data?.code === 'LOCATION_IN_USE') {
          toast({
            title: 'Cannot delete location',
            description: data.message,
            status: 'error',
            duration: TOAST_DURATION.MEDIUM,
            isClosable: true,
          });
          return;
        }
        toast({
          title: 'Error',
          description: getErrorMessage(err, 'Could not save changes. Please try again.'),
          status: 'error',
          duration: TOAST_DURATION.MEDIUM,
        });
      }
    },
    (errors) => onInvalid?.(errors),
  );

  return {
    methods,
    onSave,
    resetToInitial,
    isSaving: isUpdatingBusiness || isUpdatingSchedule || saveLocations.isSaving,
  } as const;
}
