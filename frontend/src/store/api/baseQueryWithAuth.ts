import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { resetStore } from '../actions';
import { toast } from '../../utils/toast';
import type { RootState } from '../store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

/**
 * Wraps fetchBaseQuery to handle 401 Unauthorized globally.
 * On session expiry: clears the store (logout) and shows a toast guiding
 * the user to log in again. No individual API endpoint needs to handle this.
 */
export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(resetStore());
    toast({
      title: 'Session expired',
      description: 'Please log in again to continue.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  }

  return result;
};
