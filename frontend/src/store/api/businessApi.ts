import { baseApi } from './baseApi';
import type { Business, BusinessWithServices, CreateBusinessRequest } from '../../types';

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBusiness: builder.mutation<Business, CreateBusinessRequest>({
      query: (data) => ({
        url: '/business',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Business'],
    }),
    getMyBusiness: builder.query<BusinessWithServices, void>({
      query: () => '/business/me',
      providesTags: ['Business'],
    }),
    getBusinessBySlug: builder.query<BusinessWithServices, string>({
      query: (slug) => `/business/slug/${slug}`,
    }),
    updateBusiness: builder.mutation<Business, { id: number; data: Partial<CreateBusinessRequest> }>({
      query: ({ id, data }) => ({
        url: `/business/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Business'],
    }),
  }),
});

export const {
  useCreateBusinessMutation,
  useGetMyBusinessQuery,
  useGetBusinessBySlugQuery,
  useUpdateBusinessMutation,
} = businessApi;
