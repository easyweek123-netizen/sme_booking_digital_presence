# BookEasy: GTM Technical Implementation Plan

> **Purpose:** Technical implementation details for GTM-ready MVP. For business strategy and motivation, see [AI_PRD_MOTIVATION.md](./AI_PRD_MOTIVATION.md).

---

## Current State

### What's Built

| Feature | Status | Location |
|---------|--------|----------|
| Service management | ✅ Done | `services/` module |
| Online booking page | ✅ Done | `/booking/:slug` |
| AI chat assistant | ✅ Done | `chat/` module |
| `manage_service` tool | ✅ Done | `service.tool-handler.ts` |
| Email reminders | ✅ Done | `email/` module (needs testing) |
| Conversational onboarding | ✅ Done | `ConversationalOnboarding/` |
| Dashboard layout | ✅ Done | `DashboardLayout.tsx` |

### What's Missing for GTM

| Feature | Priority | Estimate |
|---------|----------|----------|
| Client list page | P1 | 2-3 days |
| Client notes | P1 | 2-3 days |
| Session notes | P1 | 1-2 days |
| Calendar view | P2 | 3-4 days |
| Google Calendar sync | P2 | 4-5 days |
| AI tools (all DB models) | P3 | 3-4 days |
| Chat UI cards | P3 | 2 days |
| Landing page update | P4 | 1-2 days |
| Polish & testing | P4 | 3-4 days |

**Total estimate:** ~4-5 weeks

---

## Phase 1: Client Notes System (Week 1)

### 1.1 Database Changes

**Extend Customer entity:**

```typescript
// backend/src/customers/entities/customer.entity.ts
@Entity('customers')
export class Customer {
  // ... existing fields
  
  @Column({ type: 'text', nullable: true })
  notes: string;  // General client notes
  
  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    preferredTime?: string;
    allergies?: string[];
    specialNeeds?: string;
  };
}
```

**New SessionNote entity:**

```typescript
// backend/src/bookings/entities/session-note.entity.ts
@Entity('session_notes')
export class SessionNote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking)
  booking: Booking;
  
  @Column()
  bookingId: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 1.2 Backend: Customer Endpoints

**File:** `backend/src/customers/customers.controller.ts`

```typescript
// Update client notes
PATCH /customers/:id
Body: { notes?: string, preferences?: object }

// Get client with booking history
GET /customers/:id/history
Response: {
  customer: Customer,
  bookings: Booking[],  // With session notes
  totalBookings: number,
  lastVisit: Date
}

// Search customers
GET /customers?search=maria&limit=10
```

### 1.3 Backend: Session Notes Endpoints

**File:** `backend/src/bookings/bookings.controller.ts`

```typescript
// Add session note
POST /bookings/:id/notes
Body: { content: string }

// Update session note
PATCH /bookings/:bookingId/notes/:noteId
Body: { content: string }

// Get booking with notes
GET /bookings/:id
Response: {
  ...booking,
  notes: SessionNote[]
}
```

### 1.4 Frontend: Clients Page

**File:** `frontend/src/pages/dashboard/DashboardClients.tsx`

Features:
- Client list with search
- Click client → profile modal/drawer
- Client notes editor (auto-save)
- Booking history timeline
- Session notes per booking

**Component structure:**
```
DashboardClients
├── ClientSearchBar
├── ClientList
│   └── ClientCard (name, email, last visit, booking count)
└── ClientProfileDrawer
    ├── ClientInfo
    ├── ClientNotes (editable)
    └── BookingHistory
        └── BookingItem
            └── SessionNotes (editable)
```

---

## Phase 2: Calendar System (Week 2-3)

### 2.1 Backend: Calendar Endpoints

**File:** `backend/src/bookings/bookings.controller.ts`

Add endpoints:

```typescript
// Get calendar data for week/month view
GET /bookings/calendar?view=week&date=2024-01-15
GET /bookings/calendar?view=month&date=2024-01

// Response structure
{
  view: 'week' | 'month',
  startDate: string,
  endDate: string,
  bookings: [
    {
      id: number,
      date: string,
      startTime: string,
      endTime: string,
      service: { name, duration, price },
      customer: { name, email }
    }
  ]
}
```

### 2.2 Frontend: Calendar Page

**File:** `frontend/src/pages/dashboard/DashboardCalendar.tsx`

Features:
- Week view (default)
- Month view toggle
- Day cells showing bookings
- Click booking → show details modal
- Navigation (prev/next week/month)
- Today button

**Component structure:**
```
DashboardCalendar
├── CalendarHeader (view toggle, navigation)
├── CalendarWeekView
│   └── CalendarDay (7x)
│       └── CalendarBookingSlot (n bookings)
├── CalendarMonthView
│   └── CalendarDay (28-31x)
└── BookingDetailModal
```

### 2.3 Google Calendar Integration

**Backend:**

**File:** `backend/src/calendar/` (new module)

```
calendar/
├── calendar.module.ts
├── calendar.controller.ts
├── calendar.service.ts
└── dto/
    └── calendar.dto.ts
```

**Flow:**
1. User clicks "Connect Google Calendar" in settings
2. OAuth flow → get refresh token
3. Store refresh token in `owners` table (encrypted)
4. On new booking → create event in Google Calendar
5. On booking update/cancel → update/delete Google event
6. Optional: Sync from Google to BookEasy (2-way)

**Endpoints:**
```typescript
GET  /calendar/google/auth-url     // Get OAuth URL
POST /calendar/google/callback     // Handle OAuth callback
GET  /calendar/google/status       // Check connection status
POST /calendar/google/disconnect   // Remove connection
POST /calendar/google/sync         // Manual sync trigger
```

**Frontend:**

**File:** `frontend/src/pages/dashboard/DashboardSettings.tsx`

Add section:
- Google Calendar connection status
- Connect/Disconnect button
- Last sync time
- Sync now button

---

## Phase 3: AI Tools for All DB Models (Week 3-4)

### 3.1 Tool Handlers to Create

| Tool | Operations | File |
|------|------------|------|
| `manage_service` | get, create, update, delete | ✅ Done |
| `manage_clients` | list, search, get, add_note | `customer.tool-handler.ts` |
| `get_calendar` | today, tomorrow, week, date | `calendar.tool-handler.ts` |
| `manage_bookings` | list, get, cancel | `booking.tool-handler.ts` |
| `manage_profile` | get, update | `business.tool-handler.ts` |

### 3.2 Calendar Tool Handler

**File:** `backend/src/bookings/calendar.tool-handler.ts`

```typescript
@Injectable()
export class CalendarToolHandler implements ToolHandler {
  toolName = 'get_calendar';
  
  static getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: 'get_calendar',
        description: 'Get schedule/bookings for a specific day, week, or date range',
        parameters: {
          type: 'object',
          properties: {
            view: { enum: ['today', 'tomorrow', 'week', 'date'], description: 'Time period' },
            date: { type: 'string', description: 'Specific date (YYYY-MM-DD) if view is "date"' }
          },
          required: ['view']
        }
      }
    };
  }
  
  async handle(args: Record<string, unknown>, ownerId: number): Promise<ToolResult> {
    // Return bookings for requested period
  }
}
```

### 3.3 Customer Tool Handler

**File:** `backend/src/customers/customer.tool-handler.ts`

```typescript
@Injectable()
export class CustomerToolHandler implements ToolHandler {
  toolName = 'manage_clients';
  
  static getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: 'manage_clients',
        description: 'Get clients, search clients, or manage client notes',
        parameters: {
          type: 'object',
          properties: {
            operation: { enum: ['list', 'search', 'get', 'add_note'] },
            search: { type: 'string', description: 'Search term for client name/email' },
            customerId: { type: 'number', description: 'Client ID for get/add_note' },
            note: { type: 'string', description: 'Note content for add_note' }
          },
          required: ['operation']
        }
      }
    };
  }
}
```

### 3.4 Booking Tool Handler

**File:** `backend/src/bookings/booking.tool-handler.ts`

```typescript
@Injectable()
export class BookingToolHandler implements ToolHandler {
  toolName = 'manage_bookings';
  
  static getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: 'manage_bookings',
        description: 'List bookings, get booking details, or cancel a booking',
        parameters: {
          type: 'object',
          properties: {
            operation: { enum: ['list', 'get', 'cancel'] },
            bookingId: { type: 'number' },
            status: { enum: ['pending', 'confirmed', 'cancelled'] }
          },
          required: ['operation']
        }
      }
    };
  }
}
```

### 3.5 Business Profile Tool Handler

**File:** `backend/src/business/business.tool-handler.ts`

```typescript
@Injectable()
export class BusinessToolHandler implements ToolHandler {
  toolName = 'manage_profile';
  
  static getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: 'manage_profile',
        description: 'Get or update business profile information',
        parameters: {
          type: 'object',
          properties: {
            operation: { enum: ['get', 'update'] },
            name: { type: 'string' },
            description: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' }
          },
          required: ['operation']
        }
      }
    };
  }
}
```

### 3.6 Register All Tools

**File:** `backend/src/chat/tool.registry.ts`

```typescript
constructor(
  private serviceToolHandler: ServiceToolHandler,
  private calendarToolHandler: CalendarToolHandler,
  private customerToolHandler: CustomerToolHandler,
  private bookingToolHandler: BookingToolHandler,
  private businessToolHandler: BusinessToolHandler,
) {
  this.register(serviceToolHandler);
  this.register(calendarToolHandler);
  this.register(customerToolHandler);
  this.register(bookingToolHandler);
  this.register(businessToolHandler);
}
```

### 3.7 Chat UI Cards

| Card | Purpose | File |
|------|---------|------|
| `CalendarCard` | Mini calendar/schedule view | `CalendarCard.tsx` |
| `ClientCard` | Client profile with notes | `ClientCard.tsx` |
| `ClientListCard` | List of clients | `ClientListCard.tsx` |
| `BookingCard` | Single booking details | `BookingCard.tsx` |
| `BookingListCard` | List of bookings | `BookingListCard.tsx` |
| `BusinessProfileCard` | Business info display | `BusinessProfileCard.tsx` |

**Update ChatAction types:**

```typescript
export type ChatAction =
  | { type: 'service_form'; ... }
  | { type: 'services_list'; ... }
  | { type: 'calendar_view'; view: 'today' | 'week'; bookings: CalendarBooking[] }
  | { type: 'client_profile'; client: ClientProfile }
  | { type: 'client_list'; clients: ClientSummary[] }
  | { type: 'booking_details'; booking: BookingDetails }
  | { type: 'bookings_list'; bookings: BookingSummary[] }
  | { type: 'business_profile'; business: BusinessProfile };
```

---

## Phase 4: Polish & Demo Prep (Week 4-5)

### 4.1 Testing Checklist

- [ ] Email reminders send correctly (24h before booking)
- [ ] Booking confirmation emails work
- [ ] Google Calendar sync creates/updates/deletes events
- [ ] All AI tools respond correctly
- [ ] Chat cards render properly
- [ ] Mobile responsive on all pages
- [ ] Empty states have helpful CTAs
- [ ] Loading states are smooth
- [ ] Error messages are user-friendly

### 4.2 Landing Page Update

**File:** `frontend/src/pages/landing/index.tsx`

Update with niche-focused messaging:
- Hero: "You heal. You transform lives..."
- Problem section with pain points
- Feature showcase with screenshots
- Demo video embed
- Testimonials section (placeholder for now)
- CTA: "Start free"

### 4.3 Demo Preparation

**Demo flow to capture:**
1. Sign up → Conversational onboarding
2. "Add a 90-minute massage for €85"
3. Public booking page → Client books
4. "Show my schedule for today"
5. "Who's my next client?" → Client card
6. "Add note: worked on lower back tension"
7. Settings → Google Calendar connected

**Recording tips:**
- Clean test data
- Use realistic names/services
- 30-40 seconds max
- Clear audio narration

---

## File Structure Summary

### New Files to Create

```
backend/src/
├── calendar/
│   ├── calendar.module.ts
│   ├── calendar.controller.ts
│   ├── calendar.service.ts
│   └── dto/calendar.dto.ts
├── bookings/
│   ├── entities/session-note.entity.ts
│   ├── calendar.tool-handler.ts
│   └── booking.tool-handler.ts
├── customers/
│   └── customer.tool-handler.ts
└── business/
    └── business.tool-handler.ts

frontend/src/
├── pages/dashboard/
│   ├── DashboardCalendar.tsx
│   └── DashboardClients.tsx
└── components/chat/
    ├── CalendarCard.tsx
    ├── ClientCard.tsx
    ├── ClientListCard.tsx
    ├── BookingCard.tsx
    ├── BookingListCard.tsx
    └── BusinessProfileCard.tsx
```

### Files to Modify

```
backend/src/
├── customers/entities/customer.entity.ts  (add notes field)
├── customers/customers.controller.ts      (add endpoints)
├── customers/customers.service.ts         (add methods)
├── bookings/bookings.controller.ts        (add calendar, notes endpoints)
├── bookings/bookings.service.ts           (add methods)
├── chat/tool.registry.ts                  (register new tools)
└── chat/dto/chat.dto.ts                   (add action types)

frontend/src/
├── types/chat.types.ts                    (add action types)
├── components/chat/ChatMessage.tsx        (render new cards)
├── components/Dashboard/Sidebar.tsx       (add Calendar, Clients nav)
├── pages/dashboard/index.tsx              (add routes)
├── pages/dashboard/DashboardSettings.tsx  (Google Calendar section)
└── pages/landing/index.tsx                (update messaging)
```

---

## Environment Variables (New)

```bash
# Google Calendar OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://api.bookeasy.com/calendar/google/callback
```

---

## Timeline

| Week | Phase | Focus | Deliverables |
|------|-------|-------|-------------|
| 1 | P1 | Client Notes | Database, endpoints, UI, search |
| 2 | P2 | Calendar Backend | Endpoints, data structure |
| 2-3 | P2 | Calendar Frontend + Google | UI, OAuth integration |
| 3-4 | P3 | AI Tools | All tool handlers, chat cards |
| 4-5 | P4 | Polish + Demo | Testing, landing page, video |

---

## Definition of Done (GTM Ready)

- [ ] Client list with search works
- [ ] Client notes save/load correctly
- [ ] Session notes per booking work
- [ ] Calendar view works (week/month)
- [ ] Google Calendar syncs both ways
- [ ] AI can query calendar ("Show my schedule")
- [ ] AI can query clients ("Find Maria")
- [ ] AI can add notes ("Add note for Maria")
- [ ] AI can manage bookings ("Show my bookings")
- [ ] AI can update profile ("Update my description")
- [ ] Landing page updated with niche messaging
- [ ] Demo video recorded
- [ ] Deployed to production (Render)
- [ ] Ready to share with practitioners

