import type { Location } from './location';

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface BusinessType {
  id: number;
  slug: string;
  name: string;
  isActive: boolean;
}

export interface BusinessCategory {
  id: number;
  slug: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  types: BusinessType[];
}

export interface ServiceDto {
  name: string;
  durationMinutes: number;
  price: number;
  availableDays?: string[] | null;
}

export interface ServiceCategory {
  id: number;
  businessId: number;
  name: string;
  displayOrder: number;
  createdAt: string;
}

export interface Schedule {
  id: number;
  businessId: number;
  name: string;
  timezone: string | null;
  availability: import('./availability.types').Availability[];
}

export type ServiceTypeValue = 'APPOINTMENT' | 'GROUP';
export type PriceTypeValue = 'FIXED' | 'FROM' | 'FREE' | 'ON_REQUEST';

export interface Service {
  id: number;
  businessId: number;
  categoryId: number | null;
  scheduleId: number;
  type: ServiceTypeValue;
  name: string;
  description: string | null;
  capacity: number;
  durationMinutes: number;
  pauseAfterMinutes: number;
  price: string | null;
  priceType: PriceTypeValue;
  locationId: number | null;
  location?: Location | null;
  color: string | null;
  photoUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  category?: ServiceCategory | null;
  schedule?: Schedule;
}

export interface CreateServiceRequest {
  categoryId?: number | null;
  scheduleId: number;
  type: ServiceTypeValue;
  name: string;
  description?: string | null;
  capacity: number;
  durationMinutes: number;
  pauseAfterMinutes?: number;
  price?: string | null;
  priceType: PriceTypeValue;
  locationId: number;
  color?: string | null;
  photoUrl?: string | null;
}

export interface UpdateServiceRequest {
  categoryId?: number | null;
  scheduleId?: number;
  type?: ServiceTypeValue;
  name?: string;
  description?: string | null;
  capacity?: number;
  durationMinutes?: number;
  pauseAfterMinutes?: number;
  price?: string | null;
  priceType?: PriceTypeValue;
  locationId?: number;
  color?: string | null;
  photoUrl?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}

export interface CreateServiceCategoryRequest {
  name: string;
  displayOrder?: number;
}

export interface UpdateServiceCategoryRequest {
  name?: string;
  displayOrder?: number;
}

export interface Business {
  id: number;
  slug: string;
  defaultScheduleId: number;
  defaultLocation?: Location | null;
  plan?: 'free' | 'pro';
  timezone: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  logoUrl: string | null;
  brandColor: string | null;
  workingHours: WorkingHours | null;
  coverImageUrl: string | null;
  aboutContent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessWithServices extends Business {
  services: Service[];
}

export interface CreateBusinessRequest {
  name: string;
  phone?: string;
  description?: string;
  address?: string;
  city?: string;
  logoUrl?: string;
  brandColor?: string;
  workingHours?: WorkingHours;
  businessTypeId?: number | null;
  services?: ServiceDto[];
}

export interface UpdateBusinessRequest {
  name?: string;
  phone?: string;
  description?: string;
  address?: string;
  city?: string;
  website?: string;
  instagram?: string;
  logoUrl?: string;
  brandColor?: string;
  workingHours?: WorkingHours;
  coverImageUrl?: string | null;
  aboutContent?: string | null;
  timezone?: string;
}

// Onboarding types
export interface BusinessProfile {
  name: string;
  phone: string;
  description: string;
  address: string;
  city: string;
  logoUrl: string;
  brandColor: string;
  workingHours: WorkingHours;
}

export interface ServiceItem {
  id: string; // Temporary ID for frontend
  name: string;
  durationMinutes: number;
  price: number;
  availableDays: string[] | null; // null = all open days
}
