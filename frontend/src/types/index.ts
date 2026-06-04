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
  ServiceTypeValue,
  PriceTypeValue,
  CreateServiceCategoryRequest,
  UpdateServiceCategoryRequest,
  Schedule,
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
export type { Slot } from './booking.types';
export type { Availability } from './availability.types';
export type { AvailabilityInput } from '@bookeasy/shared';

// Note types
export type {
  Note,
  Customer,
  CreateNoteRequest,
  UpdateNoteRequest,
} from './note.types';

// API types
export type { ApiError, RtkQueryError } from './api.types';
export { isRtkQueryError, getErrorMessage } from './api.types';

