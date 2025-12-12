# Phase 3: Authentication Implementation

**Created:** December 4, 2025

## Split Structure

**Phase 3A: Backend Auth** - Build and test API independently  
**Phase 3B: Frontend Auth** - Login page, Signup page, protected routes

---

## Current State Analysis

**Backend (ready for auth):**
- `backend/src/owner/entities/owner.entity.ts` - Owner entity with `email`, `passwordHash`, `googleId`, `name`
- `backend/src/config/jwt.config.ts` - JWT config with secret and expiresIn
- Owner module exists but service is placeholder

**Frontend (stubs in place):**
- `frontend/src/store/slices/authSlice.ts` - with `setCredentials`, `logout` actions
- `frontend/src/store/api/authApi.ts` - stubbed endpoints
- `frontend/src/store/api/baseApi.ts` - already attaches Bearer token
- `frontend/src/types/auth.types.ts` - Auth types defined

---

## Phase 3A: Backend Auth

### 1. Install Dependencies

```bash
cd backend
npm install bcrypt @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/bcrypt @types/passport-jwt
```

### 2. Update Owner Service

Modify `backend/src/owner/owner.service.ts` to use TypeORM repository:
- `findByEmail(email)`: For login validation
- `findById(id)`: For JWT strategy
- `create(data)`: For registration

### 3. Create Auth Module Structure

```
backend/src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   └── jwt.strategy.ts
├── guards/
│   └── jwt-auth.guard.ts
└── dto/
    ├── register.dto.ts
    └── login.dto.ts
```

### 4. Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create account, return JWT |
| POST | `/api/auth/login` | Public | Validate credentials, return JWT |
| GET | `/api/auth/me` | Protected | Return current user from JWT |

### Phase 3A Verification

```bash
# Test Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Test Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test Protected Route (should fail)
curl http://localhost:3000/api/auth/me

# Test Protected Route (with token)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Phase 3B: Frontend Auth

### 5. Create Signup Page

New file: `frontend/src/pages/signup/index.tsx`
- Email, password, name form
- Form validation
- Links to login page
- Redirect to dashboard on success
- Add route `/signup` in App.tsx

### 6. Update Login Page

Update `frontend/src/pages/login/index.tsx`:
- Email/password form with Chakra UI
- Form validation with React state
- Loading/error states
- Link to signup page
- Redirect to dashboard on success

### 7. Create Auth Components/Hooks

```
frontend/src/components/auth/ProtectedRoute.tsx  # Redirect if not authenticated
frontend/src/hooks/useAuth.ts                    # Wrap RTK Query + Redux
```

### 8. Integrate in App

Update `frontend/src/App.tsx`:
- Add `/signup` route
- Wrap dashboard routes with `ProtectedRoute`
- Add route constant for SIGNUP

### Phase 3B Verification

| Test | Steps | Expected |
|------|-------|----------|
| Signup Page | Navigate to `/signup`, fill form, submit | Redirect to dashboard, token in Redux |
| Login Page | Navigate to `/login`, fill form, submit | Redirect to dashboard, token in Redux |
| Auth Persists | Refresh page after login | Still authenticated |
| Protected Route | Visit `/dashboard` without login | Redirect to `/login` |
| Logout | Click logout | Redirect to home, token cleared |

---

## Files Summary

**Phase 3A (Backend - create):**
- `src/auth/auth.module.ts`
- `src/auth/auth.controller.ts`
- `src/auth/auth.service.ts`
- `src/auth/strategies/jwt.strategy.ts`
- `src/auth/guards/jwt-auth.guard.ts`
- `src/auth/dto/register.dto.ts`
- `src/auth/dto/login.dto.ts`

**Phase 3A (Backend - modify):**
- `src/app.module.ts` - import AuthModule
- `src/owner/owner.service.ts` - add repository methods

**Phase 3B (Frontend - create):**
- `src/pages/signup/index.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/hooks/useAuth.ts`

**Phase 3B (Frontend - modify):**
- `src/pages/login/index.tsx` - full form
- `src/App.tsx` - routes + protection
- `src/config/routes.ts` - add SIGNUP

