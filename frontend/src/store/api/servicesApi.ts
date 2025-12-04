import { baseApi } from './baseApi';
import type { Service, CreateServiceRequest, UpdateServiceRequest } from '../../types';

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<Service[], number>({
      query: (businessId) => `/services/business/${businessId}`,
      providesTags: ['Service'],
    }),
    createService: builder.mutation<Service, CreateServiceRequest>({
      query: (data) => ({
        url: '/services',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Service', 'Business'],
    }),
    updateService: builder.mutation<Service, { id: number } & Partial<UpdateServiceRequest>>({
      query: ({ id, ...data }) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Service', 'Business'],
    }),
    deleteService: builder.mutation<void, number>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service', 'Business'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
