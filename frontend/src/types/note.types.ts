import type { Booking } from './booking.types';

export interface Note {
  id: number;
  content: string;
  customerId: number | null;
  bookingId: number | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  email: string | null;
  name: string;
  createdAt: string;
  bookings?: Booking[];
}

export interface CreateNoteRequest {
  content: string;
  customerId?: number;
  bookingId?: number;
}

export interface UpdateNoteRequest {
  content: string;
}

