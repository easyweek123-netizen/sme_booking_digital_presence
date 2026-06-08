import {
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
} from '../../../store/api/schedulesApi';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
} from '../../../store/api/servicesApi';
import { useCreateLocation } from '../../Locations';
import {
  SERVICE_FORM_FIELD_KEYS,
  type CreatingLocation,
  type LocationDraft,
  type ServiceFormFieldsInput,
  type ServiceFormInput,
} from '@bookeasy/shared';
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

export class InvalidLocationError extends Error {}

interface UseSaveServiceParams {
  service: Service | undefined;
  business: Business;
  initialAvailability: AvailabilityInput[];
}

function pickServiceFields(values: ServiceFormInput): ServiceFormFieldsInput {
  const out = {} as Record<string, unknown>;
  for (const key of SERVICE_FORM_FIELD_KEYS) out[key] = values[key];
  return out as ServiceFormFieldsInput;
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
  const { createLocation, isCreating: cl } = useCreateLocation();

  const saveService = async (values: ServiceFormInput): Promise<Service> => {
    const serviceFields = pickServiceFields(values);

    let scheduleId = service?.scheduleId ?? business.defaultScheduleId;
    if (!deepEqual(values.availability, initialAvailability)) {
      const ownsPrivateSchedule = service && service.scheduleId !== business.defaultScheduleId;
      if (ownsPrivateSchedule) {
        await updateSchedule({ id: scheduleId, data: { availability: values.availability } }).unwrap();
      } else {
        const created = await createSchedule({
          name: `${service?.name ?? 'Service'} schedule`,
          availability: values.availability,
        }).unwrap();
        scheduleId = created.id;
      }
    }

    const locationId = await resolveLocationId(values.location, createLocation);

    const payload = { ...serviceFields, scheduleId, locationId };
    if (service) {
      return updateService({ id: service.id, data: payload }).unwrap();
    }
    return createService({ ...payload, durationMinutes: serviceFields.durationMinutes ?? 30 }).unwrap();
  };

  return [saveService, { isSaving: cs || us || csv || usv || cl }] as const;
}

async function resolveLocationId(
  location: LocationDraft | null,
  createLocation: (creating: CreatingLocation) => Promise<number>,
): Promise<number> {
  if (!location) throw new InvalidLocationError('Pick or create a location.');
  if (location.locationId != null) return location.locationId;
  const creating: CreatingLocation =
    location.type === 'ADDRESS' ? { type: 'ADDRESS', data: location.data! }
    : location.type === 'PHONE' ? { type: 'PHONE', data: location.data! }
    : { type: 'ONLINE' };
  return createLocation(creating);
}
