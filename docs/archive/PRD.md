# BookEasy MVP - Product Requirements Document

## Overview

A mobile-first booking platform for SMEs (beauty salons, barbers, wellness practitioners) that enables business owners to create an online presence and accept appointments in minutes.

---

## User Journeys

### Business Owner Journey

```
Landing Page → "Start Now" → Onboarding Wizard (4 steps) → Create Account → Dashboard
```

**Goal:** Go from zero to a live booking page in under 3 minutes.

### Customer Journey

```
Public Booking Page → Select Service → Pick Date/Time → Enter Details → Booking Confirmed
```

**Goal:** Complete a booking in under 1 minute.

---

## Core Features

### 1. Landing Page

A welcoming homepage inspired by EasyWeek's clean aesthetic:
- Header with logo, navigation, "Log in" and "Start Now" buttons
- Hero section with value proposition and primary CTA
- Feature highlights (3-4 benefit cards)
- Footer with essential links

### 2. Onboarding Wizard

A guided 4-step flow to set up a business. Data persists in browser until account creation.

| Step | Purpose |
|------|---------|
| **Select Business Type** | Choose from categorized business types (displayed as visual cards grouped by category) |
| **Business Profile** | Enter business details: name, phone, description, address, working hours, optional fields (logo, website, social) |
| **Add Services** | Create services with name, duration, and price. Minimum 1 required. |
| **Create Account** | Register via Google OAuth or email/password |

On account creation, all data is saved atomically (owner + business + services).

### 3. Owner Dashboard

A simple admin interface for managing the business:

- **Calendar View** - Day/week view showing booked appointments
- **Bookings List** - All bookings with status and customer info
- **Service Management** - Add, edit, delete, toggle services
- **Settings** - Edit business profile and working hours
- **Public Link** - Prominently displayed booking page URL with copy button

### 4. Public Booking Page

Customer-facing page accessible via unique URL (`/book/:business-slug`):

- Business header with name, logo, description
- Contact info and working hours
- List of available services with prices
- Booking flow: select service → pick date → choose available time slot → enter contact details → confirm

**Availability Display:** Show only available time slots. Already booked slots should be hidden or marked as unavailable. Working hours determine the available time range.

---

## Business Categorization

Two-level hierarchy for flexibility and future expansion:

**Categories** (top-level groupings with icon and color):
- Beauty, Health, Wellness, etc.

**Types** (specific business types under each category):
- Beauty: Beauty Salon, Barbershop, Nail Salon, Hair Salon
- Health: Massage Therapist, Physiotherapy, Chiropractor
- Wellness: Yoga Studio, Meditation Center, Life Coach

Both categories and types are stored in the database, allowing easy addition of new types without code changes.

### MVP Seed Data

| Category | Types |
|----------|-------|
| Beauty | Beauty Salon, Barbershop, Nail Salon, Hair Salon |
| Health | Massage Therapist, Physiotherapy, Chiropractor |
| Wellness | Yoga Studio, Meditation Center, Life Coach |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| UI Components | Chakra UI |
| Routing | React Router |
| Backend | NestJS + TypeScript |
| Database | MySQL + Prisma ORM |
| Authentication | JWT + Google OAuth 2.0 |

---

## Project Structure

```
project-root/
├── frontend/           # React application
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── pages/      # Route pages
│       ├── hooks/      # Custom hooks
│       ├── services/   # API client
│       ├── context/    # React context (auth, etc.)
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
└── README.md
```

---

## Database Entities

### Categorization
- **BusinessCategory** - id, slug, name, icon, color, isActive
- **BusinessType** - id, categoryId, slug, name, isActive

### Core Entities
- **Owner** - id, email, passwordHash (nullable for OAuth), googleId, name, createdAt
- **Business** - id, ownerId, businessTypeId, slug, name, description, address, city, phone, website, instagram, logoUrl, workingHours (JSON), timestamps
- **Service** - id, businessId, name, description, durationMinutes, price, isActive, createdAt
- **Booking** - id, businessId, serviceId, customerName, customerEmail, customerPhone, date, startTime, endTime, status, createdAt

---

## API Structure

| Domain | Endpoints |
|--------|-----------|
| **Categories** | Get all categories with their types |
| **Auth** | Register, login, Google OAuth, get current user |
| **Business** | Create, read, update business profile |
| **Services** | CRUD operations for business services |
| **Bookings** | Create booking (public), list bookings, cancel booking, get availability |

---

## Pages

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Landing page |
| `/login` | Public | Login page |
| `/onboarding` | Public | 4-step setup wizard |
| `/dashboard` | Protected | Main dashboard with calendar |
| `/dashboard/bookings` | Protected | Bookings list view |
| `/dashboard/services` | Protected | Manage services |
| `/dashboard/settings` | Protected | Edit business profile |
| `/book/:slug` | Public | Customer booking page |

---

## Design Principles

- **Mobile-first** - All interfaces designed for mobile, scale up to desktop
- **Clean aesthetic** - Inspired by EasyWeek's professional look
- **Minimal friction** - Reduce steps and required fields where possible
- **Immediate value** - Let users explore before requiring account creation

---

## Success Metrics

1. Business owner: Landing to live booking page in under 3 minutes
2. Customer: Complete a booking in under 1 minute
3. Responsive design works seamlessly across all devices

---

## Out of Scope (Post-MVP)

- Email/SMS notifications
- Payment processing
- Multiple staff members per business
- Customer accounts and booking history
- Calendar integrations (Google Calendar, etc.)
- Analytics and reporting
- Industry-specific landing pages

