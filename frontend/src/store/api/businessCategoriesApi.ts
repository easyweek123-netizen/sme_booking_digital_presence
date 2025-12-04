import { baseApi } from './baseApi';
import type { BusinessCategory } from '../../types';

export const businessCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessCategories: builder.query<BusinessCategory[], void>({
      query: () => '/business-categories',
      providesTags: ['Category'],
    }),
  }),
});

export const { useGetBusinessCategoriesQuery } = businessCategoriesApi;
