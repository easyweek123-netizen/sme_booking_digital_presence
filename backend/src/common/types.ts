// Shared types for the application

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

// Auth types
export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export interface RequestWithUser extends Request {
  user: AuthUser;
}

