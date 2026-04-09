# BookEasy - Current Status

**Last Updated:** April 2026
**Read this file first** -- it gives full context for any new agent or contributor.

---

## What Is BookEasy

An AI-first booking platform for solo wellness practitioners (massage therapists, coaches, healers). Business owners create a professional booking page in 2 minutes, manage everything through an AI chat assistant or traditional dashboard.

**Live:** https://bookeasy-u8yn.onrender.com (Render free tier, 30s cold start)
**API:** https://bookeasy-api-dniv.onrender.com/api

---

## Current Strategy

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

backend/src/
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
```

---

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
```
