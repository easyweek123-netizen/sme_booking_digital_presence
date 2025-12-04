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

export interface Service {
  id: number;
  businessId: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  availableDays: string[] | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateServiceRequest {
  businessId: number;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  availableDays?: string[] | null;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  durationMinutes?: number;
  price?: number;
  availableDays?: string[] | null;
  isActive?: boolean;
}

export interface Business {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  logoUrl: string | null;
  workingHours: WorkingHours | null;
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
  workingHours: WorkingHours;
  services: ServiceDto[];
}

export interface UpdateBusinessRequest {
  name?: string;
  phone?: string;
  description?: string;
  address?: string;
  city?: string;
  website?: string;
  instagram?: string;
  workingHours?: WorkingHours;
}

// Onboarding types
export interface BusinessProfile {
  name: string;
  phone: string;
  description: string;
  address: string;
  city: string;
  workingHours: WorkingHours;
}

export interface ServiceItem {
  id: string; // Temporary ID for frontend
  name: string;
  durationMinutes: number;
  price: number;
  availableDays: string[] | null; // null = all open days
}
