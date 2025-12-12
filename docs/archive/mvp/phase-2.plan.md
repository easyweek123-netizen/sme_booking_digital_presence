# Phase 2: Database and Seed Data Implementation

**Estimated Time:** ~1 hour  
**Status:** Ready to implement

---

## Overview

Implement Phase 2 by creating a database seed script for business categories/types, implementing the GET /api/business-categories endpoint with TypeORM, adding class-validator for DTO validation, and verifying frontend integration.

---

## Tasks

### 2.1 Install Validation Dependencies

Add `class-validator` and `class-transformer` to backend:

```bash
cd backend && npm install class-validator class-transformer
```

Update `backend/src/main.ts` to enable global `ValidationPipe`.

---

### 2.2 Implement Business Categories Service

Update `backend/src/business-categories/business-categories.service.ts`:
- Inject `BusinessCategory` and `BusinessType` repositories
- Implement `findAll()` to return categories with nested types (only active ones)
- Filter by `isActive: true` for both categories and types

---

### 2.3 Simplify Controller

Update `backend/src/business-categories/business-categories.controller.ts`:
- Keep only `GET /business-categories` endpoint (for MVP)
- Remove unused CRUD endpoints

---

### 2.4 Create Seed Script

Create `backend/src/database/seeds/seed.ts`:
- Seed 3 categories: Beauty (#EC4899), Health (#14B8A6), Wellness (#22C55E)
- Seed 10 types per PRD requirements:
  - **Beauty:** Beauty Salon, Barbershop, Nail Salon, Hair Salon
  - **Health:** Massage Therapist, Physiotherapy, Chiropractor
  - **Wellness:** Yoga Studio, Meditation Center, Life Coach
- Add npm script `db:seed` to run the seed

---

### 2.5 Verify Frontend Integration

The frontend is already prepared with:
- `frontend/src/store/api/businessCategoriesApi.ts` - RTK Query hook
- `frontend/src/types/business.types.ts` - TypeScript types

Test by running the full stack and calling the API endpoint.

---

## Testing Checklist

| Test | Expected Result |
|------|-----------------|
| Run seed script | 3 categories and 10 types in MySQL |
| GET /api/business-categories | Returns categories with nested types array |
| Frontend fetch | `useGetBusinessCategoriesQuery` returns data |

---

## Files to Modify

| File | Action |
|------|--------|
| `backend/package.json` | Add class-validator, class-transformer |
| `backend/src/main.ts` | Enable ValidationPipe |
| `backend/src/business-categories/business-categories.service.ts` | Implement with TypeORM |
| `backend/src/business-categories/business-categories.controller.ts` | Simplify to GET only |
| `backend/src/database/seeds/seed.ts` | Create new file |

---

## Seed Data Reference

### Categories

| Name | Slug | Icon | Color |
|------|------|------|-------|
| Beauty | beauty | ✂️ | #EC4899 |
| Health | health | 💪 | #14B8A6 |
| Wellness | wellness | 🧘 | #22C55E |

### Business Types

| Category | Type Name | Slug |
|----------|-----------|------|
| Beauty | Beauty Salon | beauty-salon |
| Beauty | Barbershop | barbershop |
| Beauty | Nail Salon | nail-salon |
| Beauty | Hair Salon | hair-salon |
| Health | Massage Therapist | massage-therapist |
| Health | Physiotherapy | physiotherapy |
| Health | Chiropractor | chiropractor |
| Wellness | Yoga Studio | yoga-studio |
| Wellness | Meditation Center | meditation-center |
| Wellness | Life Coach | life-coach |

