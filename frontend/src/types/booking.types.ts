export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: number;
  businessId: number;
  serviceId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
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
}

export interface CreateBookingRequest {
  businessId: number;
  serviceId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  startTime: string;
}

export interface UpdateBookingStatusRequest {
  status: 'CANCELLED' | 'COMPLETED';
}

export interface AvailabilityResponse {
  slots: string[];
}

export interface BookingStats {
  total: number;
  today: number;
}
