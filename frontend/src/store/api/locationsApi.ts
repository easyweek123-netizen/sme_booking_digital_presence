import { baseApi } from './baseApi';
import type { Location, AddressCandidate } from '../../types/location';
import type { CreateLocationDto } from '@bookeasy/shared';

const BASE = '/businesses/me/locations';

export const locationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listLocations: builder.query<Location[], void>({
      query: () => BASE,
      providesTags: ['Location'],
    }),
    searchAddress: builder.query<AddressCandidate[], string>({
      query: (q) => ({ url: `${BASE}/address/search`, params: { q } }),
    }),
    createLocation: builder.mutation<Location, CreateLocationDto>({
      query: (body) => ({ url: BASE, method: 'POST', body }),
      invalidatesTags: ['Location', 'Business'],
    }),
    patchLocation: builder.mutation<Location, { id: number; body: CreateLocationDto }>({
      query: ({ id, body }) => ({ url: `${BASE}/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Location', 'Business'],
    }),
    reverseAddress: builder.query<AddressCandidate | null, { lat: number; lng: number }>({
      query: ({ lat, lng }) => ({
        url: `${BASE}/address/reverse`,
        params: { lat, lng },
      }),
    }),
    deleteLocation: builder.mutation<void, number>({
      query: (id) => ({ url: `${BASE}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Location', 'Business'],
    }),
  }),
});

export const {
  useListLocationsQuery,
  useSearchAddressQuery,
  useLazySearchAddressQuery,
  useReverseAddressQuery,
  useLazyReverseAddressQuery,
  useCreateLocationMutation,
  usePatchLocationMutation,
  useDeleteLocationMutation,
} = locationsApi;
