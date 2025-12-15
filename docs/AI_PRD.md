# BookEasy Strategy: AI-First

> **Related Documents:**
> - [AI_PRD_MOTIVATION.md](./AI_PRD_MOTIVATION.md) - Business strategy, market research, GTM plan
> - [AI_GTM_TECHNICAL.md](./AI_GTM_TECHNICAL.md) - Technical implementation plan
> - [CURRENT_STATUS.md](./CURRENT_STATUS.md) - Current development status

## Vision

Like Cursor made AI the way developers interact with code, **BookEasy makes AI the way SMEs interact with their business.**

The AI chatbot with business context IS the product.

**Tagline:** "Your practice, simplified."

---

## Target Users

**Primary (P1):** Solo Wellness & Therapy Practitioners
- Massage therapists, physiotherapists
- Craniosacral, reiki, energy healers
- Wellness coaches, nutritionists
- Yoga/Pilates instructors (1:1)

**Secondary (P2):** Music Teachers

**Geographic Focus:** Austria → DACH → Western Europe

See [AI_PRD_MOTIVATION.md](./AI_PRD_MOTIVATION.md) for market research and revenue projections.

---

## Current State

| Component | Status |
|-----------|--------|
| Landing page | Done |
| Onboarding | 3-step wizard → **Simplify to 1 step** |
| Dashboard | Full (bookings, services, settings) |
| Categories | In database (Beauty, Health, Wellness) |
| Email, QR, Tour | Done |

---

## Phase 1: AI-First Foundation

### 1.1 Simplified Onboarding

Modify existing `/onboarding` to single step:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│             Create Your Booking Page                │
│                                                     │
│  Business Name *                                    │
│  ┌───────────────────────────────────────────────┐  │
│  │  e.g., Sarah's Salon                          │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  What type of business? (optional)                  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Select category...                        ▼  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│          [Continue with Google]                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Flow:**
- Business name: Required
- Category: Optional dropdown (personalizes AI)
- Google login: Required
- After login → Create business → `/chat`

---

### 1.2 Chat Interface (Cursor-like Layout)

Add `/chat` as the primary protected interface.

```
┌──────────────────────────────────────────────────────────────────────┐
│  BookEasy                                              [User] [⚙️]   │
├────────────────────┬─────────────────────────────────────────────────┤
│                    │                                                 │
│  MENU              │                                                 │
│  ─────             │     ┌─────────────────────────────────────┐     │
│  💬 Chat      ←    │     │  🤖 Hey! I'm your barber shop       │     │
│  📊 Dashboard      │     │     assistant. I'll help you set     │     │
│  📅 Bookings       │     │     up and manage your bookings.     │     │
│  🛠️ Services       │     └─────────────────────────────────────┘     │
│  ⚙️ Settings       │                                                 │
│                    │     Suggestions:                                │
│  ─────────────     │     [Give me a tour] [Set up my page]           │
│  CHAT HISTORY      │                                                 │
│  ─────             │                                                 │
│  Today             │                                                 │
│  • Setting up...   │                                                 │
│                    │                                                 │
│  Yesterday         │                                                 │
│  • Who's coming    │                                                 │
│  • Add service     │                                                 │
│                    │                                                 │
│  [+ New Chat]      │                                                 │
│                    ├─────────────────────────────────────────────────┤
│                    │  ┌─────────────────────────────────────────┐    │
│                    │  │ Type a message...                    →  │    │
│                    │  └─────────────────────────────────────────┘    │
└────────────────────┴─────────────────────────────────────────────────┘
```

**Layout (Cursor-inspired):**

| Panel | Content | Behavior |
|-------|---------|----------|
| Left Sidebar | Menu + Chat History | Collapsible, scrollable |
| Main Area | Current chat conversation | Scrollable |

**Design Principles:**
- Clean, minimal, professional (Cursor-quality standards)
- Left sidebar collapsible
- Chat history grouped by date
- New chat button at bottom of sidebar
- Multiple chats supported in session
- Mobile: Sidebar hidden by default, hamburger menu

**Menu Structure (all protected):**
- Chat (primary, first item)
- Dashboard
- Bookings
- Services
- Settings

---

### 1.3 Bot Capabilities (Phase 1)

| Capability | Examples |
|------------|----------|
| Tour | "Give me a tour", "What can you do?" |
| Setup | "Set up my page", "Add a service", "Change brand color" |
| Information | "How do bookings work?", "How do customers find me?" |
| Schedule | "Who's coming tomorrow?", "Show this week" |
| Clients | "Who booked most?", "Show my clients" |

**Personalization:**
- With category: "Hey! I'm your [barber shop/therapy practice/yoga studio] assistant!"
- Without: "Hey! I'm your booking assistant!"

**AI Context:**
- All user-related data (business, bookings, clients, services)
- Expand and test context coverage incrementally

---

## Phase 2: Calendar Integration

After chat is stable:
- Google Calendar 2-way sync
- Calendar view in dashboard

---

## Phase 3: User Testing

- Present to 2 real users
- Watch them interact with chat
- Collect feedback on what's missing

---

## Phase 4: Iterate on Feedback

Build what users ask for.

---

## Phase 5: Premium Strategy

Monetize after validation.

---

## Key Metrics

| Metric | Target |
|--------|--------|
| Time to First Chat | < 2 min |
| Setup Completion via Chat | > 70% |
| Bot Query Success | > 80% |
| Return Visits | 2+ per week |
| Would-Pay Score | > 60% |

---

## Product Values

1. **AI-First** - Chat is the interface, dashboard is secondary
2. **Minimal Friction** - One step to start
3. **Personalized** - Category drives AI personality
4. **Clean and Professional** - Cursor-quality UI standards
5. **Ship Small, Iterate** - 2-week cycles

---

## What We Keep As Is

- Dashboard pages (overview, bookings, services, settings)
- Booking page (public customer-facing)
- Email notifications
- QR code generation
- All existing backend APIs

---

## Summary of Changes

| Current | Phase 1 |
|---------|---------|
| 3-step onboarding | 1-step (name + category + Google login) |
| Dashboard is primary | Chat is primary |
| No chat | `/chat` with Cursor-like UI |
| Tour modal | Bot gives tour via chat |
| After onboarding → Dashboard | After onboarding → Chat |

