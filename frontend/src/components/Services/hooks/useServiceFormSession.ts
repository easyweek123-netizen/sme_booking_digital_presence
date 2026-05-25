import { useGetServiceQuery } from '../../../store/api/servicesApi';
import { useGetScheduleQuery } from '../../../store/api/schedulesApi';
import { useBusiness } from '../../../contexts/useBusiness';
import type { Business, Service, AvailabilityInput } from '../../../types';

export interface ServiceFormSession {
  business: Business;
  service: Service | undefined;
  availability: AvailabilityInput[];
  isLoading: boolean;
}

/**
 * Edit mode  → GET /services/:id (service comes back with embedded schedule.availability).
 * Create mode → GET /schedules/:defaultScheduleId (no service to read availability from).
 * Exactly one network call per mount.
 */
export function useServiceFormSession(serviceId?: number): ServiceFormSession {
  const business = useBusiness();
  const isEdit = serviceId !== undefined;

  const { data: service, isLoading: loadingService } = useGetServiceQuery(
    serviceId!,
    { skip: !isEdit },
  );

  const { data: defaultSchedule, isLoading: loadingDefaultSchedule } =
    useGetScheduleQuery(business.defaultScheduleId, { skip: isEdit });

  const availability =
    service?.schedule?.availability ?? defaultSchedule?.availability ?? [];

  return {
    business,
    service,
    availability,
    isLoading: loadingService || loadingDefaultSchedule,
  };
}
