# Phase 6: Multi-Database Support & Render Deployment

## Overview

Add multi-database support (PostgreSQL/MySQL) to enable free deployment on Render while maintaining local development flexibility.

**Repository**: [https://github.com/easyweek123-netizen/sme_booking_digital_presence](https://github.com/easyweek123-netizen/sme_booking_digital_presence)

**Current State**: MySQL only

**Target State**: PostgreSQL (default) + MySQL (optional)

---

## Phase 6.1: Add Multi-Database Support

### 6.1.1 Create Feature Branch

```bash
git pull origin main
git checkout -b feature/multi-db-support
```

### 6.1.2 Update Docker Compose

Add PostgreSQL service alongside MySQL in `docker-compose.yml`:

```yaml
services:
  mysql:
    image: mysql:8
    ports: ["3306:3306"]
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: bookeasy
    volumes: [mysql_data:/var/lib/mysql]

  postgres:
    image: postgres:15
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: bookeasy
    volumes: [postgres_data:/var/lib/postgresql/data]

volumes:
  mysql_data:
  postgres_data:
```

### 6.1.3 Add PostgreSQL Driver

In `backend/package.json`:
```json
"pg": "^8.11.3"
```

### 6.1.4 Create Clean Database Configuration

Update `backend/src/config/database.config.ts` with:

- **PostgreSQL as default** when `DB_TYPE` not set
- Clean type-safe configuration object
- SSL support for production
- Clear validation with helpful error messages

### 6.1.5 Update Database Module

Update `backend/src/database/database.module.ts`:

- Use dynamic type from config
- Add SSL configuration for production
- Add connection error handling with clear messages

### 6.1.6 Update Data Source (CLI)

Update `backend/src/database/data-source.ts` for migrations with both database types.

### 6.1.7 Update Project Documentation

Update `README.md` with clear instructions:

```markdown
## Database Setup

### Option 1: PostgreSQL (Default, recommended for Render compatibility)
docker compose up postgres -d
npm run dev

### Option 2: MySQL
docker compose up mysql -d
DB_TYPE=mysql npm run dev
```

---

## Phase 6.2: Local Testing

### 6.2.1 Test with PostgreSQL (Default)

```bash
docker compose up postgres -d
npm run dev
# Test: http://localhost:5173 → Create business → Make booking
```

### 6.2.2 Test with MySQL

```bash
docker compose down
docker compose up mysql -d
DB_TYPE=mysql npm run dev
# Verify same functionality works
```

---

## Phase 6.3: Push Feature Branch

```bash
git add .
git commit -m "feat: Add multi-database support (PostgreSQL default, MySQL optional)"
git push -u origin feature/multi-db-support
```

---

## Phase 6.4: Deploy to Render

### 6.4.1 Create PostgreSQL Database

1. Render Dashboard → New → PostgreSQL
2. Name: `bookeasy-db`
3. Plan: Free
4. Copy connection details

### 6.4.2 Deploy Backend (Web Service)

1. New → Web Service → Connect GitHub
2. Branch: `feature/multi-db-support`
3. Root Directory: `backend`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run start:prod`
6. Environment Variables:

| Variable | Value |
|----------|-------|
| DB_TYPE | postgres |
| DB_HOST | (from Render DB) |
| DB_PORT | 5432 |
| DB_USERNAME | (from Render DB) |
| DB_PASSWORD | (from Render DB) |
| DB_DATABASE | (from Render DB) |
| DB_SSL | true |
| JWT_SECRET | (generate 32+ char string) |
| NODE_ENV | production |
| CORS_ORIGIN | (set after frontend deploys) |

### 6.4.3 Deploy Frontend (Static Site)

1. New → Static Site → Connect GitHub
2. Branch: `feature/multi-db-support`
3. Root Directory: `frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Environment Variables:

| Variable | Value |
|----------|-------|
| VITE_API_URL | https://your-backend.onrender.com/api |

### 6.4.4 Connect Services

1. Update backend `CORS_ORIGIN` with frontend URL
2. Trigger redeploy

### 6.4.5 Initialize Database

Via Render Shell or local with Render credentials:
```bash
npm run migration:run
npm run db:seed
```

---

## Phase 6.5: End-to-End Testing

1. Visit deployed frontend
2. Create a new business (onboarding flow)
3. Copy public booking link
4. Make a test booking as customer
5. Verify booking appears in dashboard

---

## Phase 6.6: Merge to Main

After successful deployment:

```bash
git checkout main
git merge feature/multi-db-support
git push origin main
```

Update Render services to deploy from `main` branch.

---

## Code Design Principles

1. **PostgreSQL Default**: No env vars needed for Render deployment
2. **Type Safety**: Validate DB_TYPE is 'postgres' or 'mysql'
3. **Clear Errors**: Helpful messages if database connection fails
4. **Clean Config**: Single source of truth for database settings
5. **Documentation**: README shows both database options clearly

---

## Files to Modify

| File | Change |
|------|--------|
| `docker-compose.yml` | Add PostgreSQL service |
| `backend/package.json` | Add pg driver |
| `backend/src/config/database.config.ts` | Multi-DB config with PostgreSQL default |
| `backend/src/database/database.module.ts` | Dynamic type + SSL |
| `backend/src/database/data-source.ts` | CLI migrations support |
| `README.md` | Database setup instructions |

---

## Environment Variables

### Local Development (PostgreSQL - Default)
```env
# No DB_TYPE needed - defaults to postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=bookeasy
```

### Local Development (MySQL)
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=bookeasy
```

### Render Production
```env
DB_TYPE=postgres
DB_HOST=dpg-xxx.render.com
DB_PORT=5432
DB_USERNAME=bookeasy_user
DB_PASSWORD=xxx
DB_DATABASE=bookeasy
DB_SSL=true
NODE_ENV=production
```

