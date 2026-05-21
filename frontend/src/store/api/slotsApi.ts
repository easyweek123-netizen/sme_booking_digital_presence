import { baseApi } from './baseApi';
import type { Slot } from '../../types';

interface SlotsQuery {
  serviceId: number;
  from: string;
  to: string;
}

interface SlotsResult {
  service: {
    id: number;
    type: string;
    capacity: number;
    durationMinutes: number;
    priceType: string;
  };
  slots: Slot[];
}

export const slotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSlots: builder.query<SlotsResult, SlotsQuery>({
      query: ({ serviceId, from, to }) =>
        `/slots?serviceId=${serviceId}&from=${from}&to=${to}`,
      providesTags: ['Slot'],
    }),
  }),
});

export const { useGetSlotsQuery } = slotsApi;
