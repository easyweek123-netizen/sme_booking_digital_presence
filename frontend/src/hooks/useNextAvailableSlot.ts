import { useGetSlotsQuery } from '../store/api/slotsApi';
import type { Service } from '../types';

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const isBookable = (s: Service) => s.isActive !== false && s.priceType !== 'ON_REQUEST';

interface Input {
  showNextAvailable: boolean;
  services: Service[];
}

export function useNextAvailableSlot({ showNextAvailable, services }: Input) {
  const service = services.find(isBookable);
  const today = new Date();
  const to = new Date();
  to.setDate(today.getDate() + 14);

  const { data, isLoading, isError } = useGetSlotsQuery(
    service ? { serviceId: service.id, from: ymd(today), to: ymd(to) } : (undefined as never),
    { skip: !showNextAvailable || !service },
  );

  const first = data?.slots.find((s) => s.seatsRemaining > 0);
  const next =
    first && service
      ? { start: `${first.date}T${first.startTime}`, serviceId: service.id }
      : null;

  return { data: next, isLoading, isError };
}
