# BookEasy MVP

A mobile-first booking platform for SMEs (beauty salons, barbers, wellness practitioners) that enables business owners to create an online presence and accept appointments in minutes.

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Chakra UI + Redux Toolkit
- **Backend:** NestJS + TypeScript + Prisma ORM
- **Database:** MySQL 8
- **Authentication:** JWT + Google OAuth 2.0

## Prerequisites

- Node.js >= 20.0.0
- Docker & Docker Compose
- npm

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd bookeasy
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your values if needed
```

### 3. Start Database

```bash
npm run db:up
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Start Development Servers

```bash
npm run dev
```

This starts both frontend (http://localhost:5173) and backend (http://localhost:3000).

## Project Structure

```
bookeasy/
├── frontend/           # React application
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── pages/      # Route pages
│       ├── hooks/      # Custom hooks
│       ├── services/   # API client
│       ├── store/      # Redux store and slices
│       ├── theme/      # Chakra UI theme
│       ├── types/      # TypeScript definitions
│       └── utils/      # Helper functions
│
├── backend/            # NestJS application
│   ├── src/
│   │   ├── auth/       # Authentication module
│   │   ├── business/   # Business management
│   │   ├── services/   # Service management
│   │   ├── bookings/   # Booking management
│   │   └── common/     # Shared utilities
│   └── prisma/         # Database schema and migrations
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
| `npm run db:up` | Start MySQL database container |
| `npm run db:down` | Stop database container |
| `npm run db:migrate` | Run Prisma migrations |
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

### Bookings
- `POST /api/bookings` - Create booking (public)
- `GET /api/bookings/business/:businessId` - List bookings (protected)
- `GET /api/availability/:businessId/:date` - Get available slots (public)

## License

MIT

