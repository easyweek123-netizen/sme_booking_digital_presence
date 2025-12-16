import { baseApi } from './baseApi';
import type { Customer } from '../../types';

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all customers for the authenticated owner
    getCustomers: builder.query<Customer[], void>({
      query: () => '/customers',
      providesTags: ['Customer'],
    }),

    // Get a single customer with bookings
    getCustomer: builder.query<Customer, number>({
      query: (id) => `/customers/${id}`,
      providesTags: ['Customer'],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
} = customersApi;

