import { baseApi } from './baseApi';
import type { Service, CreateServiceRequest, UpdateServiceRequest } from '../../types';

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<Service[], number>({
      query: (businessId) => `/services/business/${businessId}`,
      providesTags: ['Service'],
    }),
    getService: builder.query<Service, number>({
      query: (id) => `/services/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation<Service, CreateServiceRequest>({
      query: (data) => ({ url: '/services', method: 'POST', body: data }),
      invalidatesTags: ['Service', 'Business', 'ServiceCategory', 'Schedule'],
    }),
    updateService: builder.mutation<Service, { id: number; data: UpdateServiceRequest }>({
      query: ({ id, data }) => ({ url: `/services/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Service', 'Business', 'ServiceCategory', 'Schedule'],
    }),
    deleteService: builder.mutation<void, number>({
      query: (id) => ({ url: `/services/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Service', 'Business', 'ServiceCategory'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
