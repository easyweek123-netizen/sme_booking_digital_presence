# Phase 5: Dashboard Completion and Public Booking Page

## Overview

Complete the BookEasy MVP with a 2-click booking experience and dashboard management. The booking flow prioritizes speed and simplicity - users should book in seconds, not minutes.

---

## Implementation Phases

### Phase 5.1: Backend Bookings API (Critical Path)

Build the API endpoints needed for the booking page.

**Availability Endpoint:**
```typescript
GET /api/bookings/availability/:businessId?date=YYYY-MM-DD&serviceId=123
Response: { slots: ["09:00", "09:30", "10:00", ...] }
```

**Algorithm:**
1. Get business working hours for the requested day
2. If closed, return empty array
3. Get service duration
4. Generate slots using `SLOT_INTERVAL_MINUTES` (30 min)
5. Filter out slots extending past closing time
6. Filter out slots overlapping existing bookings
7. Return available start times only

**Create Booking Endpoint (Public):**
```typescript
POST /api/bookings
Body: { businessId, serviceId, date, startTime, customerName, customerEmail, customerPhone }
```
- Calculate endTime from service duration
- Validate slot still available (prevent double-booking)
- Return created booking

---

### Phase 5.2: Public Booking Page (2-Click Experience)

**Design Principle:** Unlike the onboarding wizard, booking should be instant. No step indicators, no "Next" buttons - just a smart single-screen form.

**Page Structure (`/book/:slug`):**

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  Bella's Beauty Salon                               │
│  Professional beauty services in downtown                   │
│  📍 New York  ·  📞 555-1234                                │
├─────────────────────────────────────────────────────────────┤
│  Select a Service                                           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Women's Haircut                            $45.00    │ │
│  │  45 min                            [ Book Now → ]     │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Hair Coloring                              $85.00    │ │
│  │  1.5 hours                         [ Book Now → ]     │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Booking Drawer (Single-Screen):**

When "Book Now" is clicked:
1. Drawer slides up from bottom
2. Today's date pre-selected, availability already fetching
3. Time slots appear grouped by Morning/Afternoon/Evening
4. User clicks a time → form slides in with animation
5. User fills form → clicks "Confirm Booking"
6. Success screen appears

```
┌─────────────────────────────────────────────────────────────┐
│  Women's Haircut                               [ ✕ ]        │
│  45 min · $45.00                                            │
├─────────────────────────────────────────────────────────────┤
│  📅 Today, December 4                        [Change →]     │
│                                                             │
│  Morning                                                    │
│  ┌────────┐ ┌────────┐ ┌════════┐ ┌────────┐               │
│  │ 9:00   │ │ 9:30   │ ║ 10:00  ║ │ 10:30  │               │
│  └────────┘ └────────┘ ╚════════╝ └────────┘               │
│                          selected                           │
│  ─────────────────────────────────────────────────────────  │
│  Your Details                           ← appears on select │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Name *                                                │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Email *                                               │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Phone *                                               │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Today · 10:00 AM                              $45.00      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Confirm Booking                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**API Flow:**
1. Page load → `GET /api/business/slug/:slug`
2. Open drawer → `GET /api/bookings/availability/:id?date=today&serviceId=X`
3. Change date → `GET /api/bookings/availability/:id?date=NEW&serviceId=X`
4. Confirm → `POST /api/bookings`

**Components to Create:**
- `frontend/src/pages/booking/index.tsx` - Main page
- `frontend/src/components/Booking/BookingDrawer.tsx` - Drawer container
- `frontend/src/components/Booking/TimeSlotGrid.tsx` - Time slot display
- `frontend/src/components/Booking/CustomerForm.tsx` - Form fields
- `frontend/src/components/Booking/BookingSuccess.tsx` - Confirmation

---

### Phase 5.3: Dashboard Pages

**Protected endpoints needed:**
```typescript
GET /api/bookings/business/:businessId?status=X&from=DATE&to=DATE
PATCH /api/bookings/:id/status { status: 'CANCELLED' | 'COMPLETED' }
```

**Bookings Page (`/dashboard/bookings`):**
- Tabs: Upcoming | Past | Cancelled
- Booking cards with customer info, service, time
- Actions: Mark Complete, Cancel

**Services Page (`/dashboard/services`):**
- Grid of service cards
- Add/Edit modal reusing `ServiceForm` component
- Toggle active, delete with confirmation

**Settings Page (`/dashboard/settings`):**
- Business profile form
- Working hours editor (reuse `WorkingHoursEditor`)
- Booking link with copy button

---

## Key Files

**Backend:**
- `backend/src/bookings/bookings.service.ts`
- `backend/src/bookings/bookings.controller.ts`
- `backend/src/bookings/dto/create-booking.dto.ts`

**Frontend:**
- `frontend/src/pages/booking/index.tsx`
- `frontend/src/components/Booking/*.tsx`
- `frontend/src/pages/dashboard/bookings.tsx`
- `frontend/src/pages/dashboard/services.tsx`
- `frontend/src/pages/dashboard/settings.tsx`

---

## Implementation Order

1. **Phase 5.1** - Backend Availability + Create Booking APIs
2. **Phase 5.2** - Public Booking Page with 2-click drawer flow
3. **Phase 5.3** - Dashboard pages (Bookings, Services, Settings)

