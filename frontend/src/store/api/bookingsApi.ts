import { baseApi } from './baseApi';
import type {
  Booking,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  AvailabilityResponse,
  BookingStats,
} from '../../types';

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get available time slots for a business on a specific date
    getAvailability: builder.query<
      AvailabilityResponse,
      { businessId: number; date: string; serviceId: number }
    >({
      query: ({ businessId, date, serviceId }) =>
        `/bookings/availability/${businessId}?date=${date}&serviceId=${serviceId}`,
    }),

    // Create a new booking (public, no auth)
    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (data) => ({
        url: '/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking'],
    }),

    // Get all bookings for a business (protected)
    getBookings: builder.query<
      Booking[],
      {
        businessId: number;
        status?: string;
        from?: string;
        to?: string;
      }
    >({
      query: ({ businessId, status, from, to }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        const queryString = params.toString();
        return `/bookings/business/${businessId}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Booking'],
    }),

    // Get booking stats for a business
    getBookingStats: builder.query<BookingStats, number>({
      query: (businessId) => `/bookings/stats/${businessId}`,
      providesTags: ['Booking'],
    }),

    // Get a single booking by ID
    getBooking: builder.query<Booking, number>({
      query: (id) => `/bookings/${id}`,
      providesTags: ['Booking'],
    }),

    // Update booking status (cancel or complete)
    updateBookingStatus: builder.mutation<
      Booking,
      { id: number; status: 'CANCELLED' | 'COMPLETED' }
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
  useGetAvailabilityQuery,
  useCreateBookingMutation,
  useGetBookingsQuery,
  useGetBookingStatsQuery,
  useGetBookingQuery,
  useUpdateBookingStatusMutation,
} = bookingsApi;
