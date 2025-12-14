# Phase 1: Authentication & Verification

## Goal

Implement verified authentication for owners and bookers using Firebase Auth.

---

## Part 1: User Flows

### Owner Authentication

Owners need verified email to receive booking notifications.

**Options:**
1. **Google** - Click to sign in (instant)
2. **Email** - Enter any email → Click link in email → Signed in

```
┌─────────────────────────────────────────────┐
│          Welcome to BookEasy                │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │      Continue with Google           │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ──────────── or use any email ──────────   │
│                                             │
│  Email: [you@company.com              ]     │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │        Send sign-in link            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Works with Gmail, Outlook, Yahoo, etc.     │
└─────────────────────────────────────────────┘
```

---

### Booker Verification

Bookers verify once per booking. Minimal friction - just name + ONE verification.

**Step 1: Select service and time** (existing flow)

**Step 2: Enter name and choose verification method**

```
┌─────────────────────────────────────────────┐
│          Complete your booking              │
│                                             │
│  Your name                                  │
│  [John Smith                          ]     │
│                                             │
│  How would you like to verify?              │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  📱  Verify with Phone              │    │
│  │      Receive SMS code               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  ✉️  Verify with Email              │    │
│  │      Receive email link             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  G  Continue with Google            │    │
│  │      Instant verification           │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Step 3a: Phone verification**
```
┌─────────────────────────────────────────────┐
│          Enter your phone number            │
│                                             │
│  [+1] [555-123-4567                   ]     │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │          Send Code                  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘

                    ↓

┌─────────────────────────────────────────────┐
│          Enter verification code            │
│                                             │
│  Code sent to +1 555-123-4567               │
│                                             │
│         [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] [ 6 ] │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         Verify & Book               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Didn't receive code? Resend                │
└─────────────────────────────────────────────┘
```

**Step 3b: Email verification**
```
┌─────────────────────────────────────────────┐
│          Enter your email                   │
│                                             │
│  [john@example.com                    ]     │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │          Send Link                  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘

                    ↓

┌─────────────────────────────────────────────┐
│          Check your email                   │
│                                             │
│          ✉️                                 │
│                                             │
│  We sent a verification link to             │
│  john@example.com                           │
│                                             │
│  Click the link to complete your booking.   │
│                                             │
│  Didn't receive it? Resend                  │
└─────────────────────────────────────────────┘
```

**Step 3c: Google verification**
```
Clicks "Continue with Google" → Google popup → Select account → Done
```

**Step 4: Booking confirmed**
```
┌─────────────────────────────────────────────┐
│              ✓ Booking Confirmed!           │
│                                             │
│  Your reference code: BK-A3X9               │
│                                             │
│  Haircut                                    │
│  Monday, Dec 15 at 2:00 PM                  │
│  Nadia's Hair Salon                         │
│                                             │
│  We'll send you a reminder before your      │
│  appointment.                               │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            Done                     │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## Part 2: Data Model

### Owner (updated)
```
Owner
├── id
├── firebaseUid (NEW - Firebase user ID)
├── email (verified)
├── name
├── businesses[]
└── createdAt
```

### Customer (NEW - for bookers)
```
Customer
├── id
├── firebaseUid (Firebase user ID)
├── email (if verified via email/Google)
├── phone (if verified via phone)
├── name
├── bookings[]
└── createdAt
```

### Booking (updated)
```
Booking
├── ... existing fields ...
├── customerId (NEW - links to Customer)
└── customerName, customerEmail, customerPhone (keep for display)
```

---

## Part 3: Migration Strategy

### Migration Order

1. **Reset existing owners** - Clear auth data before Firebase migration
2. **Add Firebase fields** - Add firebaseUid to owners
3. **Create customers table** - New table for bookers
4. **Link bookings to customers** - Add customerId to bookings

**While writing migratin add safety checks, so updates dont happen if keys exist or other industry standard validations before running migration**

### Migration 1: Reset Owners (run first)
```sql
-- Remove all existing owners (no customers yet, clean slate)
TRUNCATE TABLE owners CASCADE;
```

### Migration 2: Update Owner for Firebase
```sql
ALTER TABLE owners
  ADD COLUMN "firebaseUid" VARCHAR(128) UNIQUE,
  DROP COLUMN IF EXISTS "passwordHash",
  DROP COLUMN IF EXISTS "googleId";
```

### Migration 3: Create Customers Table
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  "firebaseUid" VARCHAR(128) UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(20),
  name VARCHAR(100) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

### Migration 4: Link Bookings to Customers
```sql
ALTER TABLE bookings
  ADD COLUMN "customerId" INTEGER REFERENCES customers(id);
```

---

## Part 4: Shared Auth Architecture

### Common Auth Service

Both owner and booker auth use a shared Firebase service:

```
frontend/src/lib/
├── firebase.ts          # Firebase init + auth methods
└── auth/
    ├── useFirebaseAuth.ts   # Shared auth hook
    ├── GoogleButton.tsx     # Reusable Google sign-in
    ├── PhoneVerification.tsx # Phone OTP flow
    ├── EmailVerification.tsx # Email link flow
    └── OtpInput.tsx         # 6-digit code input
```

### Usage Pattern

**Owner login page:**
```tsx
<GoogleButton onSuccess={handleOwnerAuth} />
<EmailVerification 
  onSuccess={handleOwnerAuth}
  redirectUrl="/dashboard"
/>
```

**Booker verification modal:**
```tsx
<PhoneVerification onSuccess={handleBookerVerified} />
<EmailVerification onSuccess={handleBookerVerified} />
<GoogleButton onSuccess={handleBookerVerified} />
```

Same components, different callbacks.

---

## Part 5: Firebase Setup ✓ COMPLETED

### Project Details

| Field | Value |
|-------|-------|
| Project Name | `bookeasy-dev` |
| Project ID | `bookeasy-dev-291cc` |
| Auth Domain | `bookeasy-dev-291cc.firebaseapp.com` |
| Production URL | `https://bookeasy-u8yn.onrender.com/` |

### Enabled Providers ✓

- [x] Google
- [x] Email link (passwordless)
- [x] Phone (with test number: `+43 664 12345678`, code: `123456`)

### Authorized Domains ✓

- `localhost`
- `bookeasy-u8yn.onrender.com`

### Limits

| Auth Method | Free Tier |
|-------------|-----------|
| Google | Unlimited |
| Email link | Unlimited |
| Phone SMS | 10,000/month |

---

## Part 6: Files to Change

### Backend

| Action | File |
|--------|------|
| ADD | `firebase/firebase.module.ts` |
| ADD | `firebase/firebase.service.ts` |
| ADD | `auth/guards/firebase-auth.guard.ts` |
| ADD | `customers/` module (entity, service, controller) |
| MODIFY | `owner/entities/owner.entity.ts` |
| MODIFY | `bookings/bookings.service.ts` |
| DELETE | `auth/strategies/jwt.strategy.ts` |
| REMOVE | bcrypt dependency |

### Frontend

| Action | File |
|--------|------|
| ADD | `lib/firebase.ts` |
| ADD | `lib/auth/` (shared components) |
| ADD | `contexts/AuthContext.tsx` |
| ADD | `components/Booking/BookerVerification.tsx` |
| MODIFY | `pages/login/index.tsx` |
| MODIFY | `components/Booking/BookingDrawer.tsx` |
| MODIFY | `store/api/baseApi.ts` (Firebase token) |
| DELETE | `pages/signup/` (merged into login) |

---

## Part 7: Testing Checklist

### Owner Auth
- [ ] Sign in with Google works
- [ ] Sign in with email link works (any email provider)
- [ ] Sign out redirects to login
- [ ] Protected routes require auth

### Booker Verification
- [ ] Can verify with Google
- [ ] Can verify with Phone SMS (receive code, enter code)
- [ ] Can verify with Email link (receive link, click)
- [ ] Customer record created after verification
- [ ] Booking linked to customer

### Edge Cases
- [ ] Wrong SMS code shows error
- [ ] Resend code works
- [ ] Link expired shows error

---

## Part 8: Implementation Order

| Day | Tasks |
|-----|-------|
| 1 | Firebase project setup, get credentials |
| 1 | Run reset migration, create Firebase migrations |
| 2 | Backend: Firebase service, auth guard |
| 2 | Backend: Customer entity and module |
| 3 | Frontend: Shared auth components |
| 3 | Frontend: Owner login page |
| 4 | Frontend: Booker verification flow |
| 5 | Testing and fixes |

---

---

# Technical Reference

> Detailed implementation code. Refer to this section during coding.

## Firebase SDK Setup

```typescript
// frontend/src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  type User,
  type ConfirmationResult,
} from 'firebase/auth';

// Config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Actual values (for reference):
// apiKey: "AIzaSyChrNjf678GHfKOestm1oQXdikpePD9GYE"
// authDomain: "bookeasy-dev-291cc.firebaseapp.com"
// projectId: "bookeasy-dev-291cc"
// appId: "1:616792254432:web:0d70440dc907290858ed85"

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Email Link Auth
export const sendEmailLink = async (email: string, redirectUrl: string) => {
  await sendSignInLinkToEmail(auth, email, {
    url: redirectUrl,
    handleCodeInApp: true,
  });
  localStorage.setItem('emailForSignIn', email);
};

export const completeEmailSignIn = async (url: string) => {
  if (!isSignInWithEmailLink(auth, url)) return null;
  const email = localStorage.getItem('emailForSignIn');
  if (!email) return null;
  const result = await signInWithEmailLink(auth, email, url);
  localStorage.removeItem('emailForSignIn');
  return result.user;
};

// Phone Auth
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initRecaptcha = (containerId: string) => {
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
};

export const sendSmsCode = (phoneNumber: string): Promise<ConfirmationResult> => {
  if (!recaptchaVerifier) throw new Error('Recaptcha not initialized');
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

export const verifySmsCode = (
  confirmationResult: ConfirmationResult,
  code: string
) => confirmationResult.confirm(code);

// Common
export const logOut = () => signOut(auth);
export { onAuthStateChanged, type User, type ConfirmationResult };
```

---

## Firebase Auth Guard (Backend)

```typescript
// backend/src/auth/guards/firebase-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { OwnerService } from '../../owner/owner.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebase: FirebaseService,
    private ownerService: OwnerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await this.firebase.verifyToken(token);
      
      // Find or create owner
      let owner = await this.ownerService.findByFirebaseUid(decoded.uid);
      if (!owner) {
        owner = await this.ownerService.create({
          firebaseUid: decoded.uid,
          email: decoded.email!,
          name: decoded.name || decoded.email!.split('@')[0],
        });
      }

      request.user = {
        id: owner.id,
        email: owner.email,
        name: owner.name,
        firebaseUid: owner.firebaseUid,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: any): string | null {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
  }
}
```

---

## Shared Auth Components

### Google Button

```typescript
// frontend/src/lib/auth/GoogleButton.tsx
import { Button } from '@chakra-ui/react';
import { signInWithGoogle } from '../firebase';
import { GoogleIcon } from '../../components/icons';

interface Props {
  onSuccess: (user: User) => void;
  onError?: (error: Error) => void;
  text?: string;
}

export function GoogleButton({ onSuccess, onError, text = 'Continue with Google' }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      onSuccess(result.user);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      isLoading={loading}
      leftIcon={<GoogleIcon />}
      variant="outline"
      size="lg"
      w="full"
    >
      {text}
    </Button>
  );
}
```

### Phone Verification

```typescript
// frontend/src/lib/auth/PhoneVerification.tsx
interface Props {
  onSuccess: (user: User) => void;
  onError?: (error: Error) => void;
}

export function PhoneVerification({ onSuccess, onError }: Props) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    try {
      setLoading(true);
      initRecaptcha('recaptcha');
      const result = await sendSmsCode(phone);
      setConfirmation(result);
      setStep('code');
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmation) return;
    try {
      setLoading(true);
      const result = await verifySmsCode(confirmation, code);
      onSuccess(result.user);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <VStack spacing={4}>
        <Input
          type="tel"
          placeholder="+1 555-123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button onClick={handleSendCode} isLoading={loading} w="full">
          Send Code
        </Button>
        <div id="recaptcha" />
      </VStack>
    );
  }

  return (
    <VStack spacing={4}>
      <Text>Enter the code sent to {phone}</Text>
      <OtpInput value={code} onChange={setCode} length={6} />
      <Button onClick={handleVerifyCode} isLoading={loading} w="full">
        Verify
      </Button>
    </VStack>
  );
}
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=AIzaSyChrNjf678GHfKOestm1oQXdikpePD9GYE
VITE_FIREBASE_AUTH_DOMAIN=bookeasy-dev-291cc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bookeasy-dev-291cc
VITE_FIREBASE_APP_ID=1:616792254432:web:0d70440dc907290858ed85
```

### Backend (.env)
```env
# Option 1: Path to service account file (recommended for local dev)
GOOGLE_APPLICATION_CREDENTIALS=./bookeasy-dev-firebase-service-account.json

# Option 2: JSON string (for Render/production)
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"bookeasy-dev-291cc",...}
```

### Service Account File Location
```
/bookeasy-dev-firebase-service-account.json  (root of project, gitignored)
```
