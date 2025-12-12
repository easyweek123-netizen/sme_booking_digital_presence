# BookEasy MVP - Implementation Plan

**Total Estimated Time: 13-16 hours**

---

## Phase 1: Project Foundation
**Estimated Time: 2 - 2.5 hours**

### 1.1 Monorepo Setup
- Create root `package.json` with npm workspaces for `frontend/` and `backend/`
- Shared scripts: `dev`, `build`, `lint` that run both apps
- Root `.gitignore`, `.env.example`, `README.md`

### 1.2 Docker Configuration

**Root `docker-compose.yml`:**
```yaml
services:
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: bookeasy
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: mysql://root:root@db:3306/bookeasy

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

**`backend/Dockerfile`:**
- Node.js base image
- Install dependencies
- Run Prisma generate
- Start NestJS in dev/prod mode

**`frontend/Dockerfile`:**
- Node.js base image
- Install dependencies
- Run Vite dev server (dev) or serve built files (prod)

**Scripts:**
- `docker-compose up` - Start entire stack (DB + BE + FE)
- `docker-compose up db` - Start only MySQL for local dev
- `npm run dev` - Run FE/BE locally against Docker DB

### 1.3 Frontend Initialization
- Initialize React + Vite + TypeScript in `frontend/`
- Install and configure Chakra UI with custom theme
- Install React Router v6
- **Install Redux Toolkit + redux-persist** for state management
- Create folder structure: `components/`, `pages/`, `hooks/`, `services/`, `store/`, `theme/`, `types/`, `utils/`
- Create placeholder `App.tsx` with ChakraProvider, RouterProvider, and Redux Provider

### 1.4 Redux Store Setup
- Create `frontend/src/store/` structure:
  - `store.ts` - Configure store with redux-persist (localStorage)
  - `slices/authSlice.ts` - User auth state
  - `slices/onboardingSlice.ts` - Onboarding wizard state (persisted)
- Configure redux-persist to persist `onboarding` slice to localStorage
- Wrap app with `<Provider>` and `<PersistGate>`

### 1.5 Backend Initialization
- Initialize NestJS in `backend/` with TypeScript
- Install Prisma, configure for MySQL (Docker connection string)
- Create folder structure with modules: `auth/`, `business/`, `services/`, `bookings/`, `common/`
- Add health check endpoint `GET /api/health`

### 1.6 Integration Setup
- Configure CORS on backend to allow frontend origin
- Create `frontend/src/services/api.ts` with axios instance
- Environment variables in `.env` files for Docker/local modes

### Phase 1 Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **T1.1: Docker DB** | Run `docker-compose up db` | MySQL container starts, accessible on port 3306 |
| **T1.2: Full Docker Stack** | Run `docker-compose up` | All 3 containers start, FE on :5173, BE on :3000, DB on :3306 |
| **T1.3: Local Dev Mode** | Start DB via Docker, run `npm run dev` | FE/BE run locally, connect to Docker MySQL |
| **T1.4: Redux DevTools** | Open browser DevTools | Redux store visible with `auth` and `onboarding` slices |

---

## Phase 2: Database & Seed Data
**Estimated Time: 1 - 1.5 hours**

### 2.1 Prisma Schema
Create complete schema in `backend/prisma/schema.prisma`:
- BusinessCategory (id, slug, name, icon, color, isActive)
- BusinessType (id, categoryId, slug, name, isActive)
- Owner (id, email, passwordHash, googleId, name, createdAt)
- Business (id, ownerId, businessTypeId, slug, name, description, address, city, phone, website, instagram, logoUrl, workingHours, timestamps)
- Service (id, businessId, name, description, durationMinutes, price, isActive, createdAt)
- Booking (id, businessId, serviceId, customerName, customerEmail, customerPhone, date, startTime, endTime, status, createdAt)

### 2.2 Seed Script
Create `backend/prisma/seed.ts` to populate:
- 3 Categories: Beauty (#EC4899), Health (#14B8A6), Wellness (#22C55E)
- 10 Types distributed across categories

### 2.3 Categories API (Backend)
- Create `business-categories` module in NestJS
- `GET /api/business-categories` returns all categories with nested types

### 2.4 Integration: Categories API Client
- Add `getBusinessCategories()` function in `frontend/src/services/api.ts`
- Create TypeScript types for Category and BusinessType in `frontend/src/types/`

### Phase 2 Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **T2.1: Migration** | Run `npx prisma migrate dev` against Docker DB | All tables created in MySQL |
| **T2.2: Seed Data** | Run `npx prisma db seed`, open Prisma Studio | 3 categories and 10 business types visible |
| **T2.3: FE Fetches Categories** | Call `getBusinessCategories()` from frontend | Returns array with 3 categories, each with nested types |

---

## Phase 3: Authentication
**Estimated Time: 2 - 2.5 hours**

### 3.1 Backend Auth Module
- Install `@nestjs/jwt`, `@nestjs/passport`, `bcrypt`
- Create DTOs: `RegisterDto`, `LoginDto`
- Endpoints:
  - `POST /api/auth/register` - Create owner, hash password, return JWT
  - `POST /api/auth/login` - Validate credentials, return JWT
  - `GET /api/auth/me` - Protected, return current owner
- JWT strategy with guards

### 3.2 Google OAuth (Backend)
- `POST /api/auth/google` - Accept Google ID token, verify, create/find owner, return JWT

### 3.3 Integration: Frontend Auth with Redux
- Add auth API functions in `frontend/src/services/api.ts`:
  - `register(email, password, name)`
  - `login(email, password)`
  - `loginWithGoogle(googleToken)`
  - `getCurrentUser()`
- **Update `authSlice.ts`:**
  - State: `user`, `token`, `isLoading`, `isAuthenticated`
  - Actions: `setCredentials`, `logout`, `setLoading`
  - Persist token in slice (redux-persist handles localStorage)
- Configure axios interceptor to attach JWT from Redux store
- Create `ProtectedRoute` component using Redux auth state
- Create `useAuth()` hook that reads from Redux

### Phase 3 Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **T3.1: Register via API** | POST to `/api/auth/register` with `{email, password, name}` | Returns 201 with JWT token, user in DB |
| **T3.2: Redux Auth Flow** | Call register from frontend | Token stored in Redux, visible in DevTools, persisted |
| **T3.3: Protected Route** | Access `/dashboard` without login | Redirects to `/login` |
| **T3.4: Auth Persists** | Login, refresh page | User still authenticated (Redux rehydrated from localStorage) |

---

## Phase 4: Frontend Pages + Business Creation
**Estimated Time: 3 - 4 hours**

### 4.1 Theme & Layout
- Custom Chakra theme: green primary (like EasyWeek), fonts, component styles
- `Header` component: logo, nav, Login/Start Now buttons, mobile hamburger
- `Footer` component
- `DashboardLayout` with collapsible sidebar

### 4.2 Landing Page (`/`)
- Hero section: headline, subtext, "Start Now" CTA
- Features section: 3-4 benefit cards with icons
- Mobile-first responsive design

### 4.3 Login Page (`/login`)
- Email/password form with validation
- Google sign-in button
- **Integration:** Dispatches Redux actions via `authSlice`
- Redirect to dashboard on success

### 4.4 Onboarding Wizard with Redux (`/onboarding`)

**Redux `onboardingSlice.ts` structure:**
```typescript
state: {
  currentStep: 1,
  businessType: { categoryId, typeId, typeName } | null,
  businessProfile: { name, phone, description, address, city, workingHours, ... } | null,
  services: [{ name, durationMinutes, price }, ...],
  isComplete: false
}
actions: setStep, setBusinessType, setBusinessProfile, addService, updateService, removeService, resetOnboarding
```

**Step 1 - Business Type:**
- **Integration:** Fetch categories using `getBusinessCategories()` API
- Display as cards grouped by category
- **Redux:** Dispatch `setBusinessType()` on selection, advance step

**Step 2 - Business Profile:**
- Form fields: name (req), phone (req), description, address, city
- Working hours: day toggles + open/close time pickers
- Optional: logo upload, website, instagram
- **Redux:** Dispatch `setBusinessProfile()` on next, data persisted automatically

**Step 3 - Add Services:**
- Form: name, duration dropdown, price
- **Redux:** Dispatch `addService()`, `updateService()`, `removeService()`
- Minimum 1 service required to proceed

**Step 4 - Create Account:**
- Google OAuth button OR email/password form
- **Integration:** On submit:
  1. Call `register()` or `loginWithGoogle()` - dispatches to `authSlice`
  2. Read onboarding data from Redux store
  3. Call `createBusiness()` API with all data
  4. Dispatch `resetOnboarding()` to clear persisted state
  5. Redirect to dashboard

### 4.5 Backend: Business Creation API
- `POST /api/business` - Create business with nested services array
  - Validates owner from JWT
  - Creates business record
  - Creates all services in transaction
  - Returns created business with services

### 4.6 Integration: Business API Client
- Add `createBusiness(data)` in `frontend/src/services/api.ts`
- Add TypeScript types for Business, Service, CreateBusinessDto

### Phase 4 Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **T4.1: Onboarding Persistence** | Complete steps 1-3, refresh browser, check Redux DevTools | State rehydrated, can continue from step 4 |
| **T4.2: Redux State Updates** | Add 2 services in step 3 | Services array in Redux has 2 items |
| **T4.3: Full Onboarding** | Complete all 4 steps | Owner + Business + Services in DB, onboarding slice reset |
| **T4.4: Landing Responsive** | View landing on mobile and desktop | Layout adapts correctly |

---

## Phase 5: Dashboard & Public Booking
**Estimated Time: 3.5 - 4.5 hours**

### 5.1 Backend: Remaining APIs

**Business Module:**
- `GET /api/business/me` - Get owner's business with services (protected)
- `PUT /api/business/:id` - Update business (protected)
- `GET /api/business/slug/:slug` - Get business by slug (public, for booking page)

**Services Module:**
- `GET /api/services/business/:businessId` - List services
- `POST /api/services` - Create service (protected)
- `PUT /api/services/:id` - Update (protected)
- `DELETE /api/services/:id` - Delete (protected)

**Bookings Module:**
- `GET /api/bookings/business/:businessId` - List bookings with filters (protected)
- `POST /api/bookings` - Create booking (public, guest customer)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (protected)
- `GET /api/availability/:businessId/:date` - Get available time slots (public)

### 5.2 Integration: API Client Extensions
Add to `frontend/src/services/api.ts`:
- `getMyBusiness()` - Fetch owner's business
- `updateBusiness(id, data)` - Update business
- `getBusinessBySlug(slug)` - Public fetch
- `getServices(businessId)`, `createService()`, `updateService()`, `deleteService()`
- `getBookings(businessId, filters)`, `createBooking()`, `cancelBooking()`
- `getAvailability(businessId, date)` - Fetch available slots

### 5.3 Dashboard Pages (using Redux for auth, local state for data)

**Calendar View (`/dashboard`):**
- **Integration:** Fetch business via `getMyBusiness()`, bookings via `getBookings()`
- Sidebar navigation
- Public link banner with copy button (uses business.slug)
- Day view calendar showing bookings
- Week view toggle

**Bookings List (`/dashboard/bookings`):**
- **Integration:** Fetch bookings with date filter via `getBookings()`
- Table/list with status badges
- Cancel button calls `cancelBooking()`

**Services (`/dashboard/services`):**
- **Integration:** Fetch services via `getServices()`, CRUD via service APIs
- Grid of service cards
- Add button opens modal → calls `createService()`
- Edit/delete per card

**Settings (`/dashboard/settings`):**
- **Integration:** Pre-fill form from `getMyBusiness()`, save via `updateBusiness()`
- Business profile form
- Working hours editor

### 5.4 Public Booking Page (`/book/:slug`)

- **Integration:** Fetch business via `getBusinessBySlug(slug)`
- Display business info header
- List services with "Book" button
- Booking modal flow:
  1. Date picker (next 14 days)
  2. **Integration:** Fetch slots via `getAvailability(businessId, date)`
  3. Time slot grid (only available slots)
  4. Customer form (name, email, phone)
  5. **Integration:** Submit via `createBooking()`
  6. Confirmation screen

### Phase 5 Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **T5.1: Dashboard Loads** | Login, go to `/dashboard` | Business info loads, calendar displays |
| **T5.2: Service CRUD** | Add service, edit name, delete another | Changes reflect in UI and persist in DB |
| **T5.3: Availability** | Book 10:00-10:30 slot, check availability same date | 10:00 slot unavailable, 10:30+ available |
| **T5.4: Customer Booking E2E** | Open public page → select service → pick date/time → fill form → submit | Booking created, confirmation shown |
| **T5.5: Owner Sees Booking** | After T5.4, check owner dashboard | New booking visible in calendar and list |

---

## Phase 6: Polish & Deploy
**Estimated Time: 1.5 - 2 hours**

### 6.1 Error Handling & UX
- Add toast notifications for API errors (Chakra useToast)
- Loading states (skeletons, spinners)
- Form validation feedback
- Empty states for lists

### 6.2 Responsive Testing
- Test all pages on mobile viewport
- Fix any layout issues

### 6.3 Docker Production Build
- Update Dockerfiles for production builds
- Multi-stage builds for smaller images
- `docker-compose.prod.yml` for production config

### 6.4 Deployment Options

**Option A: Docker on VPS**
- Push images to Docker Hub / container registry
- Deploy docker-compose to DigitalOcean / AWS EC2
- Use managed MySQL or run in container with persistent volume

**Option B: Managed Services**
- Frontend: Vercel/Netlify (set `VITE_API_URL`)
- Backend: Railway/Render (set env vars)
- Database: PlanetScale/Railway MySQL

### Phase 6 Tests

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **T6.1: Docker Prod Build** | Run `docker-compose -f docker-compose.prod.yml up` | Production build runs locally |
| **T6.2: Production E2E** | On deployed URL: register → onboard → make booking | Full flow works on production |
| **T6.3: Mobile Production** | Repeat T6.2 on mobile device | All interactions work, UI is usable |

---

## Summary

| Phase | Focus | Time | Key Integration |
|-------|-------|------|-----------------|
| 1 | Foundation + Docker | 2-2.5h | Docker Compose + CORS + Redux store |
| 2 | Database | 1-1.5h | Categories API + FE client |
| 3 | Auth | 2-2.5h | Auth APIs + Redux authSlice |
| 4 | Pages + Onboarding | 3-4h | Redux onboardingSlice + Business API |
| 5 | Dashboard + Booking | 3.5-4.5h | All CRUD APIs + full FE integration |
| 6 | Polish + Deploy | 1.5-2h | Docker prod + deployment |
| **Total** | | **13-16h** | |

---

## Project Structure with Docker

```
project-root/
├── docker-compose.yml          # Dev: DB + BE + FE
├── docker-compose.prod.yml     # Production config
├── .env.example
├── package.json
│
├── frontend/
│   ├── Dockerfile
│   ├── .env
│   └── src/
│       ├── store/
│       │   ├── store.ts
│       │   └── slices/
│       │       ├── authSlice.ts
│       │       └── onboardingSlice.ts
│       └── ...
│
└── backend/
    ├── Dockerfile
    ├── .env
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts
    └── src/
        └── ...
```

**Dev Commands:**
- `docker-compose up db` - Start MySQL only
- `npm run dev` - Run FE + BE locally
- `docker-compose up` - Run entire stack in Docker

**Prod Commands:**
- `docker-compose -f docker-compose.prod.yml build`
- `docker-compose -f docker-compose.prod.yml up -d`

