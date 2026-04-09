# BookEasy - Current Status

<<<<<<< HEAD
**Last Updated:** April 2026
**Read this file first** -- it gives full context for any new agent or contributor.
=======
**Last Updated:** December 16, 2024
>>>>>>> 6dd543c278c2cc67f8c0108e45b2d204ac452200

---

## What Is BookEasy

<<<<<<< HEAD
An AI-first booking platform for solo wellness practitioners (massage therapists, coaches, healers). Business owners create a professional booking page in 2 minutes, manage everything through an AI chat assistant or traditional dashboard.

**Live:** https://bookeasy-u8yn.onrender.com (Render free tier, 30s cold start)
**API:** https://bookeasy-api-dniv.onrender.com/api
=======
| Item | Status |
|------|--------|
| Current Phase | GTM Preparation |
| Target Niche | Solo Wellness & Therapy Practitioners |
| Next Up | Phase 2 - AI Chat Polish |
| Blockers | None |
>>>>>>> 6dd543c278c2cc67f8c0108e45b2d204ac452200

---

## Current Strategy

<<<<<<< HEAD
Ship a polished, fully free product. Build a user base. Monetize later.

**Active plan:** [LAUNCH_PLAN.md](./LAUNCH_PLAN.md)

**What we are doing now:**
- Polish the app end-to-end (fix corner cases, security issues)
- Add German language support (i18n)
- Add legal pages (Impressum, Privacy Policy, cookie consent)
- Restructure pricing page (Free / Premium Coming Soon / Custom Software CTA)
- SEO foundation (meta tags, sitemap, robots.txt)
- Launch across all channels (local outreach in Linz, social media, Product Hunt, SEO)

**What we are NOT doing now:**
- No payments / Stripe (deferred until user base exists)
- No new AI tools (driven by user feedback after launch)
- No Google Calendar integration (post-launch)
- No feature gating (everything is free)

---

## Tech Stack
=======
| Document | Purpose |
|----------|---------|
| [AI_PRD.md](./AI_PRD.md) | Core AI-first strategy |
| [AI_PRD_MOTIVATION.md](./AI_PRD_MOTIVATION.md) | Business strategy, market research, GTM plan |
| [AI_GTM_TECHNICAL.md](./AI_GTM_TECHNICAL.md) | Technical implementation plan |
| [NOTES_MODULE_IMPLEMENTATION.md](./NOTES_MODULE_IMPLEMENTATION.md) | Client notes implementation details |

---

## What's Built (Complete)

### Foundation ✅

| Feature | Status |
|---------|--------|
| Landing page | ✅ Done |
| Conversational onboarding | ✅ Done |
| Dashboard layout with sidebar | ✅ Done |
| Service management (CRUD) | ✅ Done |
| Public booking page | ✅ Done |
| Booking management | ✅ Done |
| Email notifications | ✅ Done |
| QR code generation | ✅ Done |

### AI Chat System ✅

| Feature | Status |
|---------|--------|
| Chat UI with persistence | ✅ Done |
| Groq/OpenAI integration | ✅ Done |
| System prompt with context | ✅ Done |
| Conversation history | ✅ Done |
| `manage_service` tool | ✅ Done |
| ServiceFormCard component | ✅ Done |
| Typing indicator | ✅ Done |

### Phase 1: Client Notes ✅ COMPLETE

| Feature | Status |
|---------|--------|
| Notes table with flexible schema | ✅ Done |
| Notes CRUD endpoints | ✅ Done |
| Customers list/get endpoints | ✅ Done |
| DashboardClients page | ✅ Done |
| ClientDetailDrawer with notes | ✅ Done |
| BookingDetailDrawer with notes | ✅ Done |
| CollapsibleSection component | ✅ Done |
| BookingCard component | ✅ Done |
| NotesEditor (compact + truncation) | ✅ Done |
| Notes in DashboardBookings | ✅ Done |

---

## GTM Roadmap

### Phase 2: AI Chat Polish 🔄 NEXT

**Goal:** AI helps practitioners manage everything AND create beautiful booking pages.

| Feature | Description | Status |
|---------|-------------|--------|
| `manage_clients` tool | Find clients, add notes | Pending |
| `manage_bookings` tool | View, cancel bookings | Pending |
| `get_schedule` tool | Today, tomorrow, week | Pending |
| `manage_profile` tool | Update business profile | Pending |
| `customize_page` tool | Style booking page via chat | Pending |
| Chat UI cards | Rich cards for all tools | Pending |

**Demo Scenarios:**
- "Show my schedule for today"
- "Who's my next client?"
- "Add note: prefers firm pressure"
- "Cancel my 4pm appointment"
- "Make my booking page purple with a calming vibe"

### Phase 3: Calendar Integration (Post-Launch)

**Decision:** Defer to post-launch. Users prefer Google Calendar.

| Feature | Description | Status |
|---------|-------------|--------|
| Google Calendar OAuth | Connect account | Deferred |
| One-way sync | Bookings → Google Calendar | Deferred |
| Deep links | Manage booking links in events | Deferred |

**Rationale:**
- Solo practitioners already use Google Calendar
- One-way sync (BookEasy → Google) covers 90% of use cases
- Can add after validating with real users

### Phase 4: Polish & Demo

| Task | Status |
|------|--------|
| Test email reminders | Pending |
| Landing page update (niche messaging) | Pending |
| Mobile responsive check | Pending |
| Empty states with CTAs | Pending |
| Demo video (30-40 sec) | Pending |
| Deploy to production | Pending |

---

## Timeline to GTM

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | Client Notes | ✅ Complete |
| 2-3 | AI Chat Polish | All tools + booking page customization |
| 3-4 | Polish + Demo | Landing page, video, deploy |

**Target:** 4-5 weeks to GTM-ready MVP

---

## Definition of Done (GTM Ready)

- [x] Client list with search works
- [x] Client notes save/load correctly
- [x] Session notes per booking work
- [ ] AI can query schedule ("Show my schedule")
- [ ] AI can query clients ("Find Maria")
- [ ] AI can add notes ("Add note for Maria")
- [ ] AI can manage bookings ("Show my bookings")
- [ ] AI can customize booking page ("Make it purple")
- [ ] Landing page updated with niche messaging
- [ ] Demo video recorded
- [ ] Deployed to production (Render)
- [ ] Ready to share with practitioners

---

## Codebase Structure
>>>>>>> 6dd543c278c2cc67f8c0108e45b2d204ac452200

### Frontend
- React 19 + TypeScript + Vite 7
- Chakra UI v2 + Framer Motion
- Redux Toolkit + RTK Query + redux-persist
- React Router DOM v7
- Firebase Auth (Google sign-in)

### Backend
- NestJS 11 + TypeScript
- TypeORM (PostgreSQL default, MySQL also supported via DB_TYPE)
- Firebase Admin (token verification)
- OpenAI SDK (configurable for Groq via AI_BASE_URL)
- Resend (transactional email)
- Zod (tool parameter schemas)

### Infrastructure
- Render free tier (frontend static + backend web service + PostgreSQL)
- Firebase Auth (Google sign-in, free tier)
- Resend (email, free up to 3,000/mo)
- Groq (AI, free tier)

---

## What's Built

### Core Product
- Landing page with hero carousel, how-it-works, FAQ, CTA
- Conversational onboarding (chat-style business setup)
- Public booking page (`/book/:slug`) with service selection, date/time, email confirmation
- Dashboard: overview, bookings, services, clients, settings
- Service management with categories (full CRUD)
- Booking management with status updates
- Customer management with notes
- Email notifications (new booking, confirmed, cancelled, completed)
- QR code generation for booking pages
- Pricing page (Free + Premium Coming Soon)
- Privacy Policy + Terms of Service pages
- Product tour for new users

### AI System
- AI Canvas: split-panel chat + canvas UI (desktop: resizable panels, mobile: tabs)
- Chat with Groq/OpenAI via tool-calling architecture
- Tool auto-discovery with `@ToolHandler` decorators
- Working tools: `manage_service` (CRUD), note tools (create, update, delete)
- Action registry for canvas proposals (ServiceFormCard, NoteProposal)

### Auth
- Firebase Auth with Google sign-in (owners + customers)
- `FirebaseAuthGuard` + `OwnerResolverInterceptor` for protected routes
- `CustomerResolverInterceptor` for booking customer resolution

---

## Known Issues (Fix Before Launch)

| Issue | Severity | File |
|-------|----------|------|
| Chat history in-memory (lost on restart) | High | `backend/src/chat/chat.service.ts` |
| No Impressum page (required by Austrian law) | High | Missing |
| FeedbackController GET has no auth guard | Medium | `backend/src/feedback/` |
| AdminModule defaults to `dev-secret-123` | Medium | `backend/src/admin/` |
| Privacy Policy has placeholder content | Medium | `frontend/src/pages/legal/PrivacyPolicy.tsx` |
| No cookie consent banner | Medium | Missing |
| No i18n / German language | Medium | Missing |
| Pricing shows "$0" instead of currency-neutral | Low | `frontend/src/pages/pricing/index.tsx` |
| No SEO meta tags / sitemap / robots.txt | Low | Missing |

---

## Project Structure

```
frontend/src/
├── pages/
│   ├── landing/                # Landing page
│   ├── onboarding/             # Conversational onboarding
│   ├── pricing/                # Pricing page
│   ├── legal/                  # Privacy, Terms (+ Impressum to add)
│   ├── dashboard/
│   │   ├── index.tsx           # Dashboard router + layout
│   │   ├── DashboardOverview.tsx
│   │   ├── DashboardChat.tsx   # Legacy chat route
│   │   ├── CanvasChat.tsx      # AI Canvas (primary AI entry)
│   │   ├── DashboardBookings.tsx
│   │   ├── DashboardClients.tsx
│   │   ├── DashboardServices.tsx
<<<<<<< HEAD
│   │   └── DashboardSettings.tsx
│   └── booking/                # Public booking page (/book/:slug)
├── components/
│   ├── Landing/                # Hero, HowItWorks, FAQ, CTA
│   ├── Layout/                 # Header, Footer, PublicLayout
│   ├── Dashboard/              # Sidebar, DashboardLayout
│   ├── Pricing/                # PricingCard, FeedbackForm
│   ├── chat/                   # Chat UI components
│   ├── canvas/                 # Canvas proposals (NoteProposal, etc.)
│   ├── Booking/                # Public booking components
│   ├── ClientDetailDrawer/
│   ├── BookingDetailDrawer/
│   ├── NotesEditor/
│   └── Tour/                   # Product tour
├── store/
│   ├── store.ts                # Redux store config
│   ├── api/                    # RTK Query APIs (baseApi, business, bookings, etc.)
│   └── slices/                 # Auth slice
├── config/
│   ├── routes.ts               # Route constants
│   ├── actionRegistry.ts       # Canvas action registry
│   └── actions/                # Tool action definitions
├── contexts/                   # AuthContext, TourContext
├── i18n/                       # (to be created)
└── lib/                        # Firebase config
=======
│   │   ├── DashboardSettings.tsx
│   │   └── DashboardClients.tsx  # ✅ Done
│   └── booking/              # Public booking page
├── components/
│   ├── chat/                 # Chat components
│   ├── Dashboard/            # Dashboard components
│   ├── ClientDetailDrawer/   # ✅ Done
│   ├── BookingDetailDrawer/  # ✅ Done
│   ├── BookingCard/          # ✅ Done
│   ├── CollapsibleSection/   # ✅ Done
│   ├── NotesEditor/          # ✅ Done
│   └── icons/                # SVG icons
├── store/                    # Redux + RTK Query
└── types/                    # TypeScript types
```
>>>>>>> 6dd543c278c2cc67f8c0108e45b2d204ac452200

backend/src/
<<<<<<< HEAD
├── auth/                       # Firebase auth guard, owner resolver
├── business/                   # Business CRUD
├── services/                   # Service CRUD + AI tools
│   └── tools/                  # create, list, update, delete tool handlers
├── bookings/                   # Booking management
├── customers/                  # Customer management
├── notes/                      # Notes CRUD + AI tools
│   └── tools/                  # create, update, delete tool handlers
├── chat/                       # AI chat service + tool registry
│   ├── chat.service.ts         # OpenAI integration (in-memory history!)
│   └── prompts/                # System prompt templates
├── common/tools/               # Base tool handler, auto-discovery, registry
├── email/                      # Resend email service
├── feedback/                   # Feedback form submissions
├── admin/                      # Admin endpoints (header secret auth)
├── owner/                      # Owner profile
└── database/                   # TypeORM config, migrations, seeds
=======
├── chat/                     # AI Chat module
│   ├── chat.service.ts       # AI integration
│   ├── tool.registry.ts      # Tool routing
│   └── prompts/              # Prompt templates
├── services/
│   ├── services.service.ts
│   └── service.tool-handler.ts  # ✅ Done
├── customers/
│   ├── customers.controller.ts  # ✅ Done
│   ├── customers.service.ts     # ✅ Done
│   └── customer.tool-handler.ts # 🔜 To build
├── bookings/
│   ├── bookings.controller.ts
│   └── booking.tool-handler.ts  # 🔜 To build
├── business/
│   ├── business.controller.ts
│   └── business.tool-handler.ts # 🔜 To build
├── notes/                    # ✅ Done
│   ├── notes.controller.ts
│   ├── notes.service.ts
│   └── entities/note.entity.ts
└── common/                   # Shared utilities
>>>>>>> 6dd543c278c2cc67f8c0108e45b2d204ac452200
```

---

<<<<<<< HEAD
=======
## Third-Party Services

| Service | Purpose | Status |
|---------|---------|--------|
| Firebase | Authentication | ✅ Configured |
| Resend | Transactional emails | ✅ Configured |
| Groq/OpenAI | AI chat | ✅ Configured |
| Google Calendar | Calendar sync | 🔜 Post-launch |

---

>>>>>>> 6dd543c278c2cc67f8c0108e45b2d204ac452200
## Environment Variables

### Backend
```
DB_TYPE=postgres              # postgres (default) or mysql
DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
DB_SSL=true                   # for production
CORS_ORIGIN                   # frontend URL
GOOGLE_APPLICATION_CREDENTIALS # Firebase service account path (local)
FIREBASE_SERVICE_ACCOUNT      # Firebase service account JSON (production)
RESEND_API_KEY                # optional, logs only if not set
EMAIL_FROM                    # default: onboarding@resend.dev
AI_API_KEY                    # Groq/OpenAI API key
AI_BASE_URL                   # API endpoint (Groq or OpenAI)
AI_MODEL                      # model name
ADMIN_SECRET                  # admin endpoint secret
PORT                          # default: 3000
```

<<<<<<< HEAD
### Frontend
```
VITE_API_URL                  # default: http://localhost:3000/api
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
```

---

## Coding Standards

- Frontend: [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)
- Backend: [BACKEND_GUIDE.md](./BACKEND_GUIDE.md)

---

## Docs Structure

```
docs/
├── CURRENT_STATUS.md      # This file - read first
├── LAUNCH_PLAN.md         # Active launch plan
├── FRONTEND_GUIDE.md      # Frontend coding standards
├── BACKEND_GUIDE.md       # Backend coding standards
└── archive/               # Historical docs (completed plans, old PRDs)
=======
### Future (Post-Launch)
```bash
# Google Calendar
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
>>>>>>> 6dd543c278c2cc67f8c0108e45b2d204ac452200
```
