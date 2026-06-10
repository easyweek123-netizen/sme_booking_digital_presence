import { useBusiness } from '../../../../contexts/business';
import { useGetScheduleQuery } from '../../../../store/api/schedulesApi';
import type { BusinessWithServices, AvailabilityInput } from '../../../../types';

export interface WebsiteFormSession {
  business: BusinessWithServices;
  availability: AvailabilityInput[];
  isLoading: boolean;
}

const EMPTY: AvailabilityInput[] = [];

export function useWebsiteFormSession(): WebsiteFormSession {
  const business = useBusiness();
  const { data: schedule, isLoading } = useGetScheduleQuery(business.defaultScheduleId);
  return { business, availability: schedule?.availability ?? EMPTY, isLoading };
}
