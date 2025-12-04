# BookEasy MVP

A mobile-first booking platform for SMEs (beauty salons, barbers, wellness practitioners) that enables business owners to create an online presence and accept appointments in minutes.

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Chakra UI + Redux Toolkit
- **Backend:** NestJS + TypeScript + TypeORM
- **Database:** PostgreSQL (default) or MySQL
- **Authentication:** JWT + Google OAuth 2.0

## Prerequisites

- Node.js >= 22.0.0
- Docker & Docker Compose
- npm

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/easyweek123-netizen/sme_booking_digital_presence.git
cd sme_booking_digital_presence
npm install
```

### 2. Environment Setup

```bash
# Copy example env and configure your credentials
cp backend/.env.example backend/.env

# Edit backend/.env with your database credentials
```

### 3. Start Database

#### Option 1: PostgreSQL (Default - Recommended)

```bash
docker compose up postgres -d
npm run dev
```

#### Option 2: MySQL

```bash
docker compose up mysql -d
DB_TYPE=mysql npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

## Database Configuration

The application supports both PostgreSQL and MySQL. PostgreSQL is the default for Render deployment compatibility.

### Required Environment Variables

All database credentials must be set in your `.env` file:

| Variable | Description |
|----------|-------------|
| `DB_HOST` | Database host (required) |
| `DB_USERNAME` | Database user (required) |
| `DB_PASSWORD` | Database password (required) |
| `DB_DATABASE` | Database name (required) |
| `DB_TYPE` | `postgres` (default) or `mysql` |
| `DB_PORT` | Port (default: 5432 for postgres, 3306 for mysql) |
| `DB_SSL` | Enable SSL (set `true` for production) |

### Quick Commands

```bash
# Start PostgreSQL and run app (default)
docker compose up postgres -d
npm run dev

# Start MySQL and run app
docker compose up mysql -d
DB_TYPE=mysql npm run dev

# Stop all containers
docker compose down

# View logs
docker compose logs -f postgres
docker compose logs -f mysql
```

## Project Structure

```
sme_booking_digital_presence/
├── frontend/           # React application
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── pages/      # Route pages
│       ├── hooks/      # Custom hooks
│       ├── store/      # Redux store and slices
│       ├── theme/      # Chakra UI theme
│       ├── types/      # TypeScript definitions
│       └── utils/      # Helper functions
│
├── backend/            # NestJS application
│   └── src/
│       ├── auth/       # Authentication module
│       ├── business/   # Business management
│       ├── services/   # Service management
│       ├── bookings/   # Booking management
│       ├── config/     # Configuration modules
│       ├── database/   # Database setup
│       └── common/     # Shared utilities
│
├── docs/               # Documentation
└── docker-compose.yml  # Docker configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:frontend` | Start only frontend |
| `npm run dev:backend` | Start only backend |
| `npm run build` | Build both applications |
| `npm run db:up` | Start default database container (PostgreSQL) |
| `npm run db:down` | Stop all database containers |
| `npm run db:seed` | Seed the database |

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Authentication
- `POST /api/auth/register` - Register a new owner
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (protected)

### Business
- `POST /api/business` - Create a business (protected)
- `GET /api/business/me` - Get owner's business (protected)
- `GET /api/business/slug/:slug` - Get business by slug (public)

### Services
- `GET /api/services/business/:businessId` - List services
- `POST /api/services` - Create service (protected)
- `PUT /api/services/:id` - Update service (protected)
- `DELETE /api/services/:id` - Delete service (protected)

### Bookings
- `POST /api/bookings` - Create booking (public)
- `GET /api/bookings/business/:businessId` - List bookings (protected)
- `GET /api/availability/:businessId/:date` - Get available slots (public)
- `PATCH /api/bookings/:id/status` - Update booking status (protected)

## Deployment

### Render (Free Tier)

1. Create PostgreSQL database on Render
2. Deploy backend as Web Service with environment variables
3. Deploy frontend as Static Site
4. See `docs/phase-6.plan.md` for detailed instructions

### Environment Variables for Production

Set these in your hosting platform (Render, etc.):

```env
DB_TYPE=postgres
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database
DB_SSL=true
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url
```

## License

MIT
