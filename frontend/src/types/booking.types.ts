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

export interface CreateBookingRequest {
  businessId: number;
  serviceId: number;
  customerName: string;
  customerEmail: string;
  date: string;
  startTime: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

export interface AvailabilityResponse {
  slots: string[];
}

export interface BookingStats {
  total: number;
  today: number;
}
