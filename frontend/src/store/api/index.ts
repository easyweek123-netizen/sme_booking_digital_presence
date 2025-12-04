// Base API
export { baseApi } from './baseApi';

// Health
export { useGetHealthQuery } from './healthApi';
export type { HealthResponse } from './healthApi';

// Auth
export { useLoginMutation, useRegisterMutation, useGetMeQuery } from './authApi';

// Business Categories
export { useGetBusinessCategoriesQuery } from './businessCategoriesApi';

// Business
export {
  useCreateBusinessMutation,
  useGetMyBusinessQuery,
  useGetBusinessBySlugQuery,
  useUpdateBusinessMutation,
} from './businessApi';

// Services
export {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from './servicesApi';

// Bookings
export {
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useGetAvailabilityQuery,
  useGetBookingStatsQuery,
  useGetBookingQuery,
} from './bookingsApi';

// Re-export all types from central types folder
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  WorkingHours,
  BusinessType,
  BusinessCategory,
  ServiceDto,
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
  Business,
  BusinessWithServices,
  CreateBusinessRequest,
  BookingStatus,
  CustomerData,
  Booking,
  CreateBookingRequest,
  AvailabilityResponse,
  BookingStats,
} from '../../types';
