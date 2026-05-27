import type { ServiceTypeValue } from './business.types';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface CustomerData {
  name: string;
  email: string;
}

export interface Booking {
  id: number;
  reference: string;
  businessId: number;
  serviceId: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  service?: {
    id: number;
    name: string;
    durationMinutes: number;
    price: number;
  };
  business?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Slot {
  date: string;
  startTime: string;
  endTime: string;
  seatsRemaining: number;
  capacity: number;
}

export interface CreateBookingRequest {
  serviceId: number;
  date: string;
  startTime: string;
  customerName: string;
  customerEmail: string;
  notes?: string | null;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

export interface AvailabilityResponse {
  service: {
    id: number;
    type: ServiceTypeValue;
    capacity: number;
    durationMinutes: number;
  };
  slots: Slot[];
}

export interface BookingStats {
  total: number;
  today: number;
  pending: number;
  byStatus: Record<BookingStatus, number>;
}
