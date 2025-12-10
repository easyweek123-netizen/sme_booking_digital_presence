// Auth types
export type {
  User,
  AuthResponse,
} from './auth.types';

// Business types
export type {
  DaySchedule,
  WorkingHours,
  BusinessType,
  BusinessCategory,
  ServiceCategory,
  ServiceDto,
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
  CreateServiceCategoryRequest,
  UpdateServiceCategoryRequest,
  Business,
  BusinessWithServices,
  CreateBusinessRequest,
  UpdateBusinessRequest,
  BusinessProfile,
  ServiceItem,
} from './business.types';

// Booking types
export type {
  BookingStatus,
  CustomerData,
  Booking,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  AvailabilityResponse,
  BookingStats,
} from './booking.types';

// API types
export type { ApiError, RtkQueryError } from './api.types';
export { isRtkQueryError, getErrorMessage } from './api.types';

