import { baseApi } from './baseApi';
import type { User } from '../../types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Owner'],
    }),
  }),
});

export const { useGetMeQuery } = authApi;
