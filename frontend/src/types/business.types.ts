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

export interface Service {
  id: number;
  businessId: number;
  categoryId: number | null;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  availableDays: string[] | null;
  isActive: boolean;
  imageUrl: string | null;
  displayOrder: number;
  createdAt: string;
  category?: ServiceCategory | null;
}

export interface CreateServiceRequest {
  businessId: number;
  categoryId?: number | null;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  availableDays?: string[] | null;
  imageUrl?: string | null;
  displayOrder?: number;
}

export interface UpdateServiceRequest {
  categoryId?: number | null;
  name?: string;
  description?: string;
  durationMinutes?: number;
  price?: number;
  availableDays?: string[] | null;
  isActive?: boolean;
  imageUrl?: string | null;
  displayOrder?: number;
}

export interface CreateServiceCategoryRequest {
  businessId: number;
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
