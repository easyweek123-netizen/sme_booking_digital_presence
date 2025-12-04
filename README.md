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
| Auth | JWT |
| Hosting | Render (Free Tier) |

## Features

- **Business Onboarding** - 4-step wizard to create a booking page in minutes
- **Service Management** - Add, edit, and manage services with pricing
- **Smart Scheduling** - Working hours and availability management
- **Public Booking Page** - Customers can book appointments without login
- **Dashboard** - Calendar view, bookings list, and business settings

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

| Variable | Description |
|----------|-------------|
| `DB_TYPE` | `postgres` (default) or `mysql` |
| `DB_HOST` | Database host |
| `DB_PORT` | 5432 (postgres) / 3306 (mysql) |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_DATABASE` | Database name |
| `DB_SSL` | `true` for production |
| `JWT_SECRET` | Secret for JWT tokens |
| `CORS_ORIGIN` | Frontend URL |

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
- `PRD.md` - Product requirements
- `Implementation_Plan.md` - Full implementation plan
- `phase-1.plan.md` to `phase-6.plan.md` - Phase plans
- `Phase1_Summary.md` to `Phase6_Summary.md` - Phase summaries

## License

MIT
