import { useToast } from '@chakra-ui/react';
import type { FieldErrors, UseFormReturn } from 'react-hook-form';
import { useUpdateBusinessMutation } from '../../../../store/api/businessApi';
import { useUpdateScheduleMutation } from '../../../../store/api/schedulesApi';
import { useSaveBusinessLocations, type LocationDirtyMask } from './useSaveBusinessLocations';
import { TOAST_DURATION } from '../../../../constants';
import { getErrorMessage } from '../../../../types';
import type { BusinessWithServices } from '../../../../types';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';

interface Params {
  business: BusinessWithServices;
  methods: UseFormReturn<WebsiteFormValues>;
  onInvalid?: (errors: FieldErrors<WebsiteFormValues>) => void;
}

export function useSaveWebsiteForm({ business, methods, onInvalid }: Params) {
  const toast = useToast();
  const [updateBusiness, { isLoading: isUpdatingBusiness }] = useUpdateBusinessMutation();
  const [updateSchedule, { isLoading: isUpdatingSchedule }] = useUpdateScheduleMutation();
  const saveLocations = useSaveBusinessLocations();

  const onSave = methods.handleSubmit(
    async (values) => {
      const { dirtyFields } = methods.formState;
      try {
        const ops: Promise<unknown>[] = [];

        const businessIsDirty =
          !!dirtyFields.basic ||
          !!dirtyFields.about ||
          !!dirtyFields.workingHoursVisibilityOnBookingPage;

        if (businessIsDirty) {
          ops.push(
            updateBusiness({
              ...values.basic,
              ...values.about,
              ...values.workingHoursVisibilityOnBookingPage,
            }).unwrap(),
          );
        }

        if (dirtyFields.availability) {
          ops.push(
            updateSchedule({
              id: business.defaultScheduleId,
              data: { availability: values.availability },
            }).unwrap(),
          );
        }

        if (dirtyFields.location) {
          ops.push(
            saveLocations.save({
              current: business.locations ?? [],
              drafts: values.location.locations,
              dirtyMask: dirtyFields.location?.locations as LocationDirtyMask,
            }),
          );
        }

        await Promise.all(ops);
        toast({ title: 'Website saved', status: 'success', duration: TOAST_DURATION.MEDIUM });
      } catch (err) {
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
    onSave,
    isSaving: isUpdatingBusiness || isUpdatingSchedule || saveLocations.isSaving,
  } as const;
}
