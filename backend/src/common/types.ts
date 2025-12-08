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
  firebaseUid?: string;
}

export interface RequestWithUser extends Request {
  user: AuthUser;
}

// Firebase user data - subset of DecodedIdToken we actually use
export interface FirebaseUser {
  uid: string;
  email?: string;
  name?: string;
}

// Firebase auth request - used after FirebaseAuthGuard
export interface RequestWithFirebaseUser extends Request {
  firebaseUser: FirebaseUser;
}

// Customer request - used after CustomerResolverInterceptor
export interface RequestWithCustomer extends Request {
  customerId: number;
}

