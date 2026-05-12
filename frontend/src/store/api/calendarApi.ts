import { baseApi } from './baseApi';
import type { CalendarStatus, CalendarSyncLog } from '../../types/calendar.types';

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarStatus: builder.query<CalendarStatus, void>({
      query: () => '/calendar/status',
      providesTags: ['Calendar'],
    }),
    getSyncLog: builder.query<CalendarSyncLog[], { limit?: number } | void>({
      query: (args) => ({ url: '/calendar/sync-log', params: args?.limit ? { limit: args.limit } : undefined }),
      providesTags: ['Calendar'],
    }),
    getGoogleAuthUrl: builder.mutation<{ authUrl: string }, void>({
      query: () => ({ url: '/calendar/google/auth-url', method: 'GET' }),
    }),
    disconnectGoogle: builder.mutation<void, void>({
      query: () => ({ url: '/calendar/google/disconnect', method: 'POST' }),
      invalidatesTags: ['Calendar'],
    }),
  }),
});

export const {
  useGetCalendarStatusQuery,
  useGetSyncLogQuery,
  useGetGoogleAuthUrlMutation,
  useDisconnectGoogleMutation,
} = calendarApi;
