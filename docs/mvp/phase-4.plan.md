# Phase 4: Frontend Pages + Business Creation

## Aesthetics Priority

This phase introduces core user-facing flows. Prioritize visual polish:

- **Mobile-first**: Design for 375px width first, then scale up
- **Animations**: Use Framer Motion for step transitions, form reveals, micro-interactions
- **Typography**: Use font weights strategically (600 for headings, 400 for body, 500 for labels)
- **Spacing**: Generous whitespace, consistent padding (use layout constants)
- **Color**: Brand green (#2EB67D) for CTAs and progress, subtle grays for backgrounds
- **Feedback**: Loading states, success animations, smooth transitions between steps
- **Touch targets**: Minimum 44px for all interactive elements on mobile

---

## Phase 4A: Backend APIs + Onboarding Wizard

### 4A.1 Backend Schema Updates

**Business Entity** (`backend/src/business/entities/business.entity.ts`):
```typescript
// Make businessTypeId nullable (category removed from onboarding)
@Column({ nullable: true })
businessTypeId: number | null;

// Working hours structure (already exists, ensure typed):
@Column({ type: 'json', nullable: true })
workingHours: {
  monday: { isOpen: boolean; openTime: string; closeTime: string };
  tuesday: { isOpen: boolean; openTime: string; closeTime: string };
  // ... all 7 days
} | null;
```

**Service Entity** (`backend/src/services/entities/service.entity.ts`):
```typescript
// NEW: Which days this service is available
@Column({ type: 'json', nullable: true })
availableDays: string[] | null;  
// null = all business open days
// ["monday", "wednesday"] = restricted to these days
```

**Slot Interval**: Hardcoded as constant, not stored in DB:
```typescript
// backend/src/common/constants.ts
export const SLOT_INTERVAL_MINUTES = 15;
```

### 4A.2 Backend API Endpoints

**Business Module:**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/business` | Create business with services | Yes |
| GET | `/api/business/me` | Get owner's business with services | Yes |
| PATCH | `/api/business/:id` | Update business | Yes |

**Services Module:**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/services` | Add service to business | Yes |
| GET | `/api/services/business/:id` | Get services for business | No |
| PATCH | `/api/services/:id` | Update service | Yes |
| DELETE | `/api/services/:id` | Delete service | Yes |

**Create Business Request:**
```typescript
{
  name: string,              // Required
  phone?: string,
  description?: string,
  address?: string,
  city?: string,
  workingHours: WorkingHours, // Required
  services: [{
    name: string,
    durationMinutes: number,
    price: number,
    availableDays?: string[] | null
  }]
}
```

### 4A.3 Frontend: Onboarding Wizard (3 Steps)

**File Structure:**
```
components/onboarding/
├── index.ts
├── OnboardingStepper.tsx      # Progress indicator
├── ProfileStep.tsx            # Step 1: Business details
├── ServicesStep.tsx           # Step 2: Add services
├── AuthStep.tsx               # Step 3: Login/Signup
├── WorkingHoursEditor.tsx     # 7-day grid component
├── ServiceCard.tsx            # Display added service
└── ServiceForm.tsx            # Inline add/edit form

pages/onboarding/
└── index.tsx                  # Wizard container
```

**Step 1: Business Profile**

| Field | Required | Notes |
|-------|----------|-------|
| Business Name | Yes | - |
| Working Hours | Yes | Grid editor, default Mon-Fri 9:00-17:00 |
| Phone | No | - |
| Description | No | Textarea |
| Address | No | - |
| City | No | - |

**WorkingHoursEditor UX:**
- 7-row grid (one row per day)
- Each row: Toggle switch | Day name | Start time dropdown | End time dropdown
- Default: Mon-Fri enabled 09:00-17:00, Sat-Sun disabled
- Time dropdowns: 15-min increments (00, 15, 30, 45)
- Smooth toggle animations

**Step 2: Services Setup**

| Field | Required | Notes |
|-------|----------|-------|
| Service Name | Yes | - |
| Duration | Yes | Dropdown: 15, 30, 45, 60, 90, 120 min |
| Price | Yes | Number input with currency |
| Available Days | No | Default: all open days |

**Service Form UX (Inline Accordion):**
- "Add Service" button shows inline form (not modal)
- Form slides down with animation
- Save → form transforms into ServiceCard
- Edit button on card → expands back to form
- Delete with confirmation
- Minimum 1 service required to proceed

**Service Availability UX:**
- Checkbox: "Available all open days" (default: checked)
- Uncheck → reveal 7 day toggles
- Gray out days business is closed

**Step 3: Login/Signup (Guests Only)**
- Signup form: Name, Email, Password
- "Already have an account? Log in" link switches to login form
- On submit: Register/Login → Create Business → Redirect to Dashboard

**Stepper Component:**
- Desktop: Horizontal with step labels ("Profile", "Services", "Account")
- Mobile: Compact progress dots with current step name
- All steps clickable (free navigation)
- States: completed (checkmark), current (highlighted), upcoming (gray)
- Smooth transitions between steps

**State Management** (`frontend/src/store/slices/onboardingSlice.ts`):
```typescript
interface OnboardingState {
  currentStep: number;  // 1, 2, or 3
  businessProfile: {
    name: string;
    phone: string;
    description: string;
    address: string;
    city: string;
    workingHours: WorkingHours;
  } | null;
  services: Array<{
    id: string;  // temp frontend ID
    name: string;
    durationMinutes: number;
    price: number;
    availableDays: string[] | null;
  }>;
}
```

### 4A.4 Landing Page Update

Update "Start Now" button in Hero and Header:
```typescript
const handleStartNow = () => {
  if (isAuthenticated) {
    navigate('/dashboard');
  } else {
    navigate('/onboarding');
  }
};
```

### 4A.5 Frontend Constants

```typescript
// constants/booking.ts
export const SLOT_INTERVAL_MINUTES = 15;

export const SERVICE_DURATIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 
  'friday', 'saturday', 'sunday'
] as const;
```

---

## Phase 4B: Dashboard Shell

### 4B.1 Dashboard Layout

**File Structure:**
```
components/Dashboard/
├── index.ts
├── DashboardLayout.tsx    # Main layout wrapper
├── Sidebar.tsx            # Desktop sidebar nav
├── MobileNav.tsx          # Mobile hamburger menu
└── StatsCard.tsx          # Stat display component

pages/dashboard/
└── index.tsx              # Dashboard home
```

**DashboardLayout:**
- Desktop: Fixed sidebar (240px) + scrollable main area
- Mobile: Full-width content + hamburger menu
- Sidebar items: Overview, Bookings, Services, Settings
- Active state on current route
- Smooth sidebar collapse animation on mobile

**StatsCard:**
- Icon + value + label
- Subtle hover effect
- Responsive grid (3 columns desktop, stack mobile)

### 4B.2 Dashboard Home Page

- Welcome header: "Welcome back, {businessName}"
- Stats row: Total Bookings, Today's Bookings, Active Services
- Public booking link with copy button (toast on copy)
- Today's schedule section (placeholder for MVP)

---

## Type Updates

**`frontend/src/types/business.types.ts`:**
```typescript
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

export interface Service {
  // ... existing fields
  availableDays: string[] | null;  // NEW
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

export interface ServiceDto {
  name: string;
  durationMinutes: number;
  price: number;
  availableDays?: string[] | null;
}
```

---

## Implementation Order

**Phase 4A:**
1. Backend: Update entities (nullable businessTypeId, service availableDays)
2. Backend: Business service + controller + DTOs
3. Backend: Services service + controller + DTOs
4. Frontend: Update types and onboardingSlice
5. Frontend: Create booking constants
6. Frontend: Build onboarding components (Stepper, WorkingHoursEditor)
7. Frontend: Build ProfileStep, ServicesStep, AuthStep
8. Frontend: Wire up onboarding page
9. Frontend: Update landing page Start Now logic

**Phase 4B:**
1. Frontend: Create Dashboard components (Layout, Sidebar, MobileNav)
2. Frontend: Create StatsCard component
3. Frontend: Build dashboard home page

---

## Booking Algorithm Reference (for Phase 5)

```
isSlotAvailable(businessId, serviceId, date, startTime):
  1. business = getBusinessById(businessId)
  2. service = getServiceById(serviceId)
  3. dayOfWeek = getDayOfWeek(date)  // "monday", etc.
  
  4. if (!business.workingHours[dayOfWeek].isOpen)
       return { available: false, reason: "Business closed" }
  
  5. if (service.availableDays !== null && 
       !service.availableDays.includes(dayOfWeek))
       return { available: false, reason: "Service not available" }
  
  6. businessClose = business.workingHours[dayOfWeek].closeTime
     serviceEnd = startTime + service.durationMinutes
     if (serviceEnd > businessClose)
       return { available: false, reason: "Not enough time" }
  
  7. conflictingBookings = findBookings(businessId, date, startTime, serviceEnd)
     if (conflictingBookings.length > 0)
       return { available: false, reason: "Time slot taken" }
  
  8. return { available: true }
```

Slot interval (15 min) is used when generating available time slots for the booking calendar UI.

