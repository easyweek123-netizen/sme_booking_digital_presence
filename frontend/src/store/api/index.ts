// Base API
export { baseApi } from './baseApi';

// Health
export { useGetHealthQuery } from './healthApi';
export type { HealthResponse } from './healthApi';

// Auth
export { useRegisterMutation, useGetMeQuery, useLogoutMutation } from './authApi';

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
  useGetBusinessServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from './servicesApi';

// Bookings
export {
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useGetBookingStatsQuery,
  useGetBookingQuery,
} from './bookingsApi';

// Chat
export {
  useSendMessageMutation,
  useSendActionResultMutation,
  useListConversationsQuery,
  useCreateConversationMutation,
  useDeleteConversationMutation,
  useGetConversationMessagesQuery,
} from './chatApi';

// Notes
export {
  useGetNotesQuery,
  useGetNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from './notesApi';

// Customers
export {
  useGetCustomersQuery,
  useGetCustomerQuery,
} from './customersApi';

// Locations
export {
  useListLocationsQuery,
  useSearchAddressQuery,
  useReverseAddressQuery,
  useCreateLocationMutation,
  useDeleteLocationMutation,
} from './locationsApi';
export type { Location, LocationType, AddressCandidate } from '../../types/location';

// Re-export all types from central types folder
export type {
  User,
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
  BookingStats,
  Note,
  Customer,
  CreateNoteRequest,
  UpdateNoteRequest,
} from '../../types';
