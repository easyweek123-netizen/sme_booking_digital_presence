import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from './baseQueryWithAuth';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Owner',
    'Business',
    'Service',
    'ServiceCategory',
    'Booking',
    'Category',
    'Customer',
    'Note',
    'Billing',
    'Invoice',
    'Pricing',
  ],
  endpoints: () => ({}),
});
