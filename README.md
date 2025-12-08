# BookEasy MVP

A mobile-first booking platform for SMEs (beauty salons, barbers, wellness practitioners) that enables business owners to create an online presence and accept appointments in minutes.

## 🚀 Live Demo

- **App:** [https://bookeasy-u8yn.onrender.com](https://bookeasy-u8yn.onrender.com)
- **API:** [https://bookeasy-api-dniv.onrender.com/api](https://bookeasy-api-dniv.onrender.com/api)

> Note: Free tier - backend may take ~30s to wake up after inactivity.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript + Chakra UI + Redux Toolkit |
| Backend | NestJS + TypeScript + TypeORM |
| Database | PostgreSQL (default) / MySQL |
| Auth | Firebase Authentication |
| Hosting | Render (Free Tier) |

## Firebase

Authentication is handled by Firebase Auth with Google sign-in for both business owners and customers.

| Resource | Link |
|----------|------|
| Console | [Firebase Console](https://console.firebase.google.com/u/3/project/bookeasy-dev-291cc/overview) |
| Project ID | `bookeasy-dev-291cc` |

**Enabled Providers:** Google (Email link and Phone SMS enabled but not yet implemented)

## Features

- **Business Onboarding** - 4-step wizard to create a booking page in minutes
- **Service Management** - Add, edit, and manage services with pricing
- **Smart Scheduling** - Working hours and availability management
- **Public Booking Page** - Customers can book appointments without login
- **Dashboard** - Calendar view, bookings list, and business settings
- **Email Notifications** - Automated alerts to owners and confirmations to customers

## Local Development

### Prerequisites

- Node.js >= 22.0.0
- Docker & Docker Compose

### Quick Start

```bash
# Clone and install
git clone https://github.com/easyweek123-netizen/sme_booking_digital_presence.git
cd sme_booking_digital_presence
npm install

# Setup environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start PostgreSQL and run app
docker compose up postgres -d
npm run db:seed
npm run dev
```

Access at: http://localhost:5173

### Database Options

```bash
# PostgreSQL (default)
docker compose up postgres -d
npm run dev

# MySQL
docker compose up mysql -d
DB_TYPE=mysql npm run dev
```

### Environment Variables

#### Backend

| Variable | Description |
|----------|-------------|
| `DB_TYPE` | `postgres` (default) or `mysql` |
| `DB_HOST` | Database host |
| `DB_PORT` | 5432 (postgres) / 3306 (mysql) |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_DATABASE` | Database name |
| `DB_SSL` | `true` for production |
| `CORS_ORIGIN` | Frontend URL |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account JSON (local) |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON string (production) |
| `RESEND_API_KEY` | Resend API key for emails (optional, logs only if not set) |
| `EMAIL_FROM` | Email sender address (default: `onboarding@resend.dev`) |

#### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

## Project Structure

```
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Route pages
│   │   ├── store/        # Redux + RTK Query
│   │   └── types/        # TypeScript types
│   └── public/
│
├── backend/           # NestJS API
│   └── src/
│       ├── auth/         # Authentication
│       ├── business/     # Business management
│       ├── services/     # Service management
│       ├── bookings/     # Booking management
│       └── database/     # DB config & seeds
│
└── docs/              # Documentation
```

## Render Deployment

The app is deployed on Render's free tier:

| Service | Type | Dashboard |
|---------|------|-----------|
| Database | PostgreSQL | [bookeasy-db](https://dashboard.render.com/d/dpg-d4ov4tu3jp1c73do9930-a) |
| Backend | Web Service | [bookeasy-api](https://dashboard.render.com/web/srv-d4ov92muk2gs73d1cv40) |
| Frontend | Static Site | [bookeasy-ui](https://dashboard.render.com/static/srv-d4ove86r433s73eb1db0) |

### Deployment Notes

- Backend uses `npm ci --include=dev && npm run build` for build command
- Frontend has SPA rewrite rule: `/* → /index.html`
- Database seed must be run locally with external DB URL

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend |
| `npm run build` | Build both apps |
| `npm run db:seed` | Seed database with categories |

## Documentation

See `/docs` folder for detailed documentation:

### MVP Documentation (`/docs/mvp/`)
- `PRD.md` - Product requirements
- `Implementation_Plan.md` - Full implementation plan
- Phase plans and summaries

### Launch Documentation (`/docs/launch/`)
- `launch-plan.md` - Launch roadmap and phases
- `phase1-auth-verification.md` - Firebase auth implementation details
- `phase1-summary.md` - Phase 1 completion summary
- `phase2-email-summary.md` - Email notifications implementation

### Development Guides
- `FRONTEND_GUIDE.md` - Frontend coding standards
- `BACKEND_GUIDE.md` - Backend coding standards

## License

MIT
