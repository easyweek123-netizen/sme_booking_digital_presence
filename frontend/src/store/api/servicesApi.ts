import { baseApi } from './baseApi';
import type {
  Service,
  ServiceCategory,
  CreateServiceRequest,
  UpdateServiceRequest,
  CreateServiceCategoryRequest,
  UpdateServiceCategoryRequest,
} from '../../types';

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Service endpoints
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

    // Service Category endpoints (separate module)
    getServiceCategories: builder.query<ServiceCategory[], number>({
      query: (businessId) => `/service-categories/business/${businessId}`,
      providesTags: ['ServiceCategory'],
    }),
    createServiceCategory: builder.mutation<ServiceCategory, CreateServiceCategoryRequest>({
      query: (data) => ({
        url: '/service-categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ServiceCategory'],
    }),
    updateServiceCategory: builder.mutation<ServiceCategory, { id: number } & Partial<UpdateServiceCategoryRequest>>({
      query: ({ id, ...data }) => ({
        url: `/service-categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ServiceCategory'],
    }),
    deleteServiceCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/service-categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceCategory', 'Service', 'Business'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceCategoriesQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} = servicesApi;
