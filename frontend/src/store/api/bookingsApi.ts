import { baseApi } from './baseApi';
import type {
  Booking,
  BookingStatus,
  CreateBookingRequest,
  BookingStats,
} from '../../types';

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (data) => ({
        url: '/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking'],
    }),

    getBookingByReference: builder.query<Booking, string>({
      query: (reference) => `/bookings/status/${reference}`,
      providesTags: ['Booking'],
    }),

    getBookings: builder.query<
      Booking[],
      {
        status?: string;
        from?: string;
        to?: string;
      }
    >({
      query: ({ status, from, to } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        const queryString = params.toString();
        return `/bookings${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Booking'],
    }),

    getBookingStats: builder.query<BookingStats, void>({
      query: () => `/bookings/stats`,
      providesTags: ['Booking'],
    }),

    getBooking: builder.query<Booking, number>({
      query: (id) => `/bookings/${id}`,
      providesTags: ['Booking'],
    }),

    updateBookingStatus: builder.mutation<
      Booking,
      { id: number; status: BookingStatus }
    >({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingByReferenceQuery,
  useGetBookingsQuery,
  useGetBookingStatsQuery,
  useGetBookingQuery,
  useUpdateBookingStatusMutation,
} = bookingsApi;
