# Phase 1: Authentication - Summary

## Status: COMPLETE (Partial)

Google authentication implemented for MVP. Phone SMS and Email link verification deferred for future enhancement.

---

## What Was Implemented

### Backend

| Component | Description |
|-----------|-------------|
| `FirebaseModule` | Global module for Firebase Admin SDK |
| `FirebaseService` | Token verification, user lookup |
| `FirebaseAuthGuard` | Protects owner routes |
| `CustomerResolverInterceptor` | Resolves/creates customers for bookings |
| `Customer` entity | Stores booker information |
| Owner `firebaseUid` | Links owners to Firebase accounts |

### Frontend

| Component | Description |
|-----------|-------------|
| `lib/firebase.ts` | Firebase SDK initialization |
| `AuthContext` | Firebase auth state management |
| `GoogleButton` | Reusable Google sign-in button |
| `BookerVerification` | Verification flow for bookings |

### Database Migrations

1. `UpdateOwnerForFirebase` - Add firebaseUid, remove password fields
2. `CreateCustomersTable` - New table for bookers
3. `AddCustomerIdToBookings` - Link bookings to customers
4. `RemovePhoneFields` - Clean up unused phone columns
5. `MakeCustomerIdRequired` - Enforce customer relationship
6. `MakeOwnerFirebaseUidRequired` - Enforce Firebase auth
7. `AddOwnerFirebaseUidIndex` - Performance optimization

---

## Firebase Project

| Field | Value |
|-------|-------|
| Console | [Firebase Console](https://console.firebase.google.com/u/3/project/bookeasy-dev-291cc/overview) |
| Project ID | `bookeasy-dev-291cc` |
| Auth Domain | `bookeasy-dev-291cc.firebaseapp.com` |

### Enabled Auth Providers

| Provider | Status |
|----------|--------|
| Google | ✅ Implemented |
| Email Link | ⏳ Enabled, not implemented |
| Phone SMS | ⏳ Enabled, not implemented |

### Test Credentials (Phone Auth)

- Number: `+43 664 12345678`
- Code: `123456`

---

## Environment Variables

### Backend

```env
# Option 1: Path to service account file (local dev)
GOOGLE_APPLICATION_CREDENTIALS=./bookeasy-dev-firebase-service-account.json

# Option 2: JSON string (production/Render)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### Frontend

```env
VITE_FIREBASE_API_KEY=AIzaSyChrNjf678GHfKOestm1oQXdikpePD9GYE
VITE_FIREBASE_AUTH_DOMAIN=bookeasy-dev-291cc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bookeasy-dev-291cc
VITE_FIREBASE_APP_ID=1:616792254432:web:0d70440dc907290858ed85
```

---

## Auth Flows

### Owner Login

```
User clicks "Continue with Google" 
  → Google OAuth popup 
  → Firebase returns user 
  → Backend creates/finds Owner by firebaseUid 
  → User redirected to dashboard
```

### Booker Verification

```
Booker selects service and time 
  → Enters name (optional) 
  → Clicks "Continue with Google" 
  → Firebase returns user 
  → Backend creates/finds Customer 
  → Booking created with customerId
```

---

## Deferred for Future

### Phone SMS Verification

Components needed:
- `PhoneVerification.tsx` - Phone input + OTP entry
- `OtpInput.tsx` - 6-digit code input
- Firebase `signInWithPhoneNumber` integration

### Email Link Verification

Components needed:
- `EmailVerification.tsx` - Email input + waiting state
- Firebase `sendSignInLinkToEmail` integration
- Return URL handler

---

## Key Files

### Backend

```
backend/src/
├── firebase/
│   ├── firebase.module.ts
│   ├── firebase.service.ts
│   └── index.ts
├── auth/
│   ├── guards/
│   │   ├── firebase-auth.guard.ts
│   │   └── index.ts
│   └── auth.service.ts
├── customers/
│   ├── entities/customer.entity.ts
│   ├── customers.service.ts
│   ├── customers.module.ts
│   └── interceptors/
│       └── customer-resolver.interceptor.ts
└── owner/
    └── entities/owner.entity.ts (updated)
```

### Frontend

```
frontend/src/
├── lib/
│   ├── firebase.ts
│   └── auth/
│       ├── GoogleButton.tsx
│       └── index.ts
├── contexts/
│   └── AuthContext.tsx
└── components/Booking/
    └── BookerVerification.tsx
```

---

## Security Notes

1. **Service account file** is gitignored - never commit
2. **Firebase tokens** are verified server-side via Admin SDK
3. **Unprotected endpoints** (OwnerController, CustomersController) were deleted
4. **Owner routes** protected by `FirebaseAuthGuard`
5. **Booking routes** use `CustomerResolverInterceptor` for customer resolution

