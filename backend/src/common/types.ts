import type { Request } from 'express';

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
  /** From ID token `email_verified`; required for email-based UID rebind */
  emailVerified?: boolean;
}

// Firebase auth request - used after FirebaseAuthGuard
export interface RequestWithFirebaseUser extends Request {
  firebaseUser: FirebaseUser;
}

// Customer request - used after CustomerResolverInterceptor
export interface RequestWithCustomer extends Request {
  customerId: number;
}

/** Owner request — after FirebaseAuthGuard + OwnerResolverGuard */
export interface RequestWithOwner extends RequestWithFirebaseUser {
  ownerId: number;
}

/** Owner request with derived businessId - after FirebaseAuthGuard + OwnerResolverGuard + BusinessOwnershipGuard */
export interface RequestWithBusiness extends RequestWithOwner {
  businessId: number;
}
