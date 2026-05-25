import {
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
} from '../../../store/api/schedulesApi';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
} from '../../../store/api/servicesApi';
import type { ServiceFormInput } from '@bookeasy/shared';
import type { Business, Service, AvailabilityInput } from '../../../types';

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, (b as unknown[])[i]));
  }
  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k) =>
    deepEqual(
      (a as Record<string, unknown>)[k],
      (b as Record<string, unknown>)[k],
    ),
  );
}

interface UseSaveServiceParams {
  service: Service | undefined;
  business: Business;
  initialAvailability: AvailabilityInput[];
}

export function useSaveService({
  service,
  business,
  initialAvailability,
}: UseSaveServiceParams) {
  const [createSchedule, { isLoading: cs }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: us }] = useUpdateScheduleMutation();
  const [createService, { isLoading: csv }] = useCreateServiceMutation();
  const [updateService, { isLoading: usv }] = useUpdateServiceMutation();

  const saveService = async (values: ServiceFormInput): Promise<Service> => {
    const { availability, ...serviceFields } = values;
    let scheduleId = service?.scheduleId ?? business.defaultScheduleId;

    if (!deepEqual(availability, initialAvailability)) {
      const ownsPrivateSchedule =
        service && service.scheduleId !== business.defaultScheduleId;

      if (ownsPrivateSchedule) {
        await updateSchedule({
          id: scheduleId,
          data: { availability },
        }).unwrap();
      } else {
        const created = await createSchedule({
          name: `${service?.name ?? 'Service'} schedule`,
          availability,
        }).unwrap();
        scheduleId = created.id;
      }
    }

    if (service) {
      return updateService({
        id: service.id,
        data: { ...serviceFields, scheduleId },
      }).unwrap();
    }
    return createService({ ...serviceFields, scheduleId }).unwrap();
  };

  return [saveService, { isSaving: cs || us || csv || usv }] as const;
}
