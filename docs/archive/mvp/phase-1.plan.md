# Phase 1: Project Foundation

## Phase 1A - Infrastructure and Backend Foundation

### 1A.1 Monorepo Setup

- Root `package.json` with npm workspaces (`frontend/`, `backend/`)
- `.gitignore` for Node.js, IDE files, env files, Docker volumes
- `.env.example` with placeholder values
- `README.md` with setup instructions

### 1A.2 Docker Configuration

- `docker-compose.yml` with MySQL 8 service (port 3306, persistent volume)
- Simple config - just database for now (FE/BE run locally during dev)

### 1A.3 Backend Initialization

- Scaffold NestJS in `backend/` with TypeScript
- Install and configure Prisma for MySQL
- Create initial `schema.prisma` (connection config only, entities in Phase 2)
- Create module folder structure: `auth/`, `business/`, `services/`, `bookings/`, `common/`
- Add health check endpoint `GET /api/health`
- Configure global API prefix `/api`
- Configure CORS to allow `http://localhost:5173`

### Phase 1A Verification

| Test | Command | Expected Result |
|------|---------|-----------------|
| MySQL starts | `docker-compose up db` | MySQL accessible on port 3306 |
| Backend runs | `cd backend && npm run start:dev` | NestJS starts on port 3000 |
| Health check | `curl http://localhost:3000/api/health` | Returns `{ "status": "ok" }` |
| Prisma connects | `cd backend && npx prisma db push` | No errors, connects to MySQL |

---

## Phase 1B - Frontend Foundation

### 1B.1 Frontend Initialization

- Scaffold React + Vite + TypeScript in `frontend/`
- Install dependencies: `@chakra-ui/react`, `@emotion/react`, `@emotion/styled`, `framer-motion`, `react-router-dom`, `@reduxjs/toolkit`, `redux-persist`, `axios`
- Create folder structure: `components/`, `pages/`, `hooks/`, `services/`, `store/`, `theme/`, `types/`, `utils/`

### 1B.2 Chakra UI Theme

- Create custom theme in `frontend/src/theme/index.ts`
- Green primary color scheme (EasyWeek-inspired)
- Custom fonts and component styles

### 1B.3 Redux Store Setup

- `frontend/src/store/store.ts` - Configure store with redux-persist
- `frontend/src/store/slices/authSlice.ts` - User, token, isAuthenticated state
- `frontend/src/store/slices/onboardingSlice.ts` - Wizard state (persisted to localStorage)
- Wrap app with `Provider` and `PersistGate`

### 1B.4 React Router and API Client

- Set up React Router with placeholder routes (`/`, `/login`, `/onboarding`, `/dashboard`)
- Create `frontend/src/services/api.ts` with axios instance
- Configure base URL from environment variable
- Add root dev script to run both FE and BE

### Phase 1B Verification

| Test | Command | Expected Result |
|------|---------|-----------------|
| Frontend runs | `cd frontend && npm run dev` | Vite starts on port 5173 |
| Chakra works | Open browser | Styled placeholder page renders |
| Redux works | Open Redux DevTools | Shows `auth` and `onboarding` slices |
| API client works | Call health endpoint from FE | Console logs successful response |
| Full stack | `npm run dev` (from root) | Both FE and BE running together |

---

## Key Files Summary

**Phase 1A:**
| File | Purpose |
|------|---------|
| `package.json` | Root monorepo config |
| `docker-compose.yml` | MySQL service |
| `.gitignore`, `.env.example`, `README.md` | Project setup |
| `backend/package.json` | NestJS dependencies |
| `backend/src/main.ts` | NestJS bootstrap with CORS |
| `backend/src/app.controller.ts` | Health endpoint |
| `backend/prisma/schema.prisma` | DB connection config |

**Phase 1B:**
| File | Purpose |
|------|---------|
| `frontend/package.json` | React dependencies |
| `frontend/src/main.tsx` | App entry with providers |
| `frontend/src/App.tsx` | Router setup |
| `frontend/src/theme/index.ts` | Chakra theme |
| `frontend/src/store/store.ts` | Redux store config |
| `frontend/src/store/slices/authSlice.ts` | Auth state |
| `frontend/src/store/slices/onboardingSlice.ts` | Onboarding state |
| `frontend/src/services/api.ts` | Axios instance |

### To-dos

- [ ] Phase 1A: Create root package.json, .gitignore, .env.example, README
- [ ] Phase 1A: Create docker-compose.yml with MySQL service
- [ ] Phase 1A: Initialize NestJS with Prisma, CORS, health endpoint
- [ ] Phase 1A: Verify MySQL, backend, and Prisma connection work
- [ ] Phase 1B: Initialize React + Vite + TypeScript with dependencies
- [ ] Phase 1B: Set up Chakra theme and Redux store with slices
- [ ] Phase 1B: Configure React Router and axios API client
- [ ] Phase 1B: Verify full stack runs together and Redux works

