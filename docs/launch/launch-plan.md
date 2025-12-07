# BookEasy: Free Version Launch Plan

## Vision

Launch a **production-ready free version** with verified users, email notifications, and professional branding. Premium features coming later.

---

## Product Tiers

```
FREE VERSION (Launch Now)              PREMIUM (Coming Soon)
─────────────────────────              ────────────────────
✓ Professional booking page            ○ Multi-page website builder
✓ Logo + brand color                   ○ Advanced SEO
✓ Unlimited services                   ○ Visitor analytics  
✓ Unlimited bookings                   ○ Custom domain
✓ Email notifications                  ○ Remove BookEasy branding
✓ QR code for sharing                  ○ Priority support
✓ Verified bookings (Email/Google)
✓ Owner verification (Email/Google)
✓ Google Analytics
✓ Working hours + contact links
```

---

## Phase 1: Authentication & Verification

**Goal:** Ensure all users (owners and bookers) are verified before using the platform.

### 1.1 Business Owner Verification

#### Signup Flow

| Method | Flow |
|--------|------|
| Google | Click "Continue with Google" → Account created (auto-verified) |
| Email | Enter email → Receive 6-digit code → Enter code → Set password → Account created |

#### Login Flow

| Method | Flow |
|--------|------|
| Google | Click "Continue with Google" → Logged in |
| Email | Enter email + password → Logged in |

#### Requirements

- New owners signing up with email must verify before accessing dashboard. Need to reduce friction here interms of steps to login etc. Want to defer login/signup until its abolutely required. And user must provide valid emails.
- Google signup = auto-verified (Google already verified the email)
- Existing owners (already in DB) should be marked as verified - We can mark them verified for now. But i shall also want to test this with empty DB
- Show clear error if verification code is wrong/expired
- Code expires after 10 minutes
- Allow resend code (max 3 times per hour)

---

### 1.2 Booker Verification

**Goal:** Reduce fake/spam bookings while keeping friction minimal.

#### Booking Flow

```
Step 1: Select service and time slot
Step 2: Enter details (name, email, phone)
Step 3: Click "Book Now"
Step 4: Verification popup appears
        ┌─────────────────────────────────────┐
        │  Verify to complete booking         │
        │                                     │
        │  [Continue with Google]             │
        │           or                        │
        │  [Send code to john@email.com]      │
        └─────────────────────────────────────┘
Step 5: Complete verification (Google or enter code)
Step 6: Booking confirmed → Show reference code
```

#### Requirements

- Booker does NOT need an account (no password to remember)
- Verification required for every booking (for now)
- If booker uses same email again, still need to verify (no login)
- Store customer record in database (for owner to see history)
- Reference code shown after booking for status checking
- We can ask user if they want to login with google or verify email with code to make booking
---

### 1.3 Customer Records

**Goal:** Track customers for business owners.

We need to think well about schema of this table. This should contain details which are valuable foruseful for Owner but still not have too much data for customer to fill.
| What to Store | Purpose |
|---------------|---------|
| Name | Display to owner |
| Email (verified) | Contact, de-duplication |
| Phone (optional) | Contact |
| Google ID (if used) | Faster future verification |
| First booking date | Analytics |

**Owner Dashboard:**
- See list of customers who booked
- See booking history per customer (future enhancement)

---

## Phase 2: Email Notifications

**Goal:** Send professional emails to verified addresses.

### 2.1 Email Types

| Email | When Sent | To Whom |
|-------|-----------|---------|
| Verification Code | On signup/booking | Owner/Booker |
| Booking Confirmation | After booking verified | Customer |
| New Booking Alert | After booking verified | Business Owner |
| Booking Reminder | 24 hours before | Customer |
| Booking Cancelled | On cancellation | Customer + Owner |

### 2.2 Email Content Requirements

**Verification Code Email:**
- Subject: "Your BookEasy verification code"
- Body: 6-digit code, expires in 10 minutes
- Clean, simple design

**Booking Confirmation Email:**
- Subject: "Booking confirmed at [Business Name]"
- Body: Service, date/time, business address, reference code
- "Add to Calendar" link (Google Calendar)
- Business logo + brand color

**New Booking Alert Email:**
- Subject: "New booking: [Customer Name] - [Service]"
- Body: Customer details, service, date/time
- Quick actions: Confirm / Cancel (links to dashboard)

**Booking Reminder Email:**
- Subject: "Reminder: Your appointment tomorrow at [Business Name]"
- Body: Same as confirmation
- Sent 24 hours before appointment

### 2.3 Provider

- Resend.com (3,000 free emails/month)
- Professional templates with business branding

---

## Phase 3: QR Code Generation

**Goal:** Easy way for businesses to share their booking page.

### Features

| Feature | Description |
|---------|-------------|
| QR Code Display | Show on Dashboard Overview |
| Download PNG | High-resolution for printing |
| Link Preview | Show booking URL below QR |

### Use Cases

- Print and display in shop window
- Add to business cards
- Share on social media

---

## Phase 4: Visual Polish

**Goal:** Make the product look professional and trustworthy.

### 4.1 Booking Page

| Element | Improvement |
|---------|-------------|
| Hero Section | Larger logo, gradient background using brand color |
| Service Cards | Better shadows, smooth hover animations |
| Verification Modal | Clean, trustworthy design |
| Footer | "Powered by BookEasy" with link |
| Mobile | Fully responsive, touch-friendly |

### 4.2 Dashboard

| Element | Improvement |
|---------|-------------|
| Overview | Better stats visualization |
| Empty States | Helpful prompts when no data |
| Loading | Skeleton loaders instead of spinners |
| Mobile | Improved mobile navigation |

### 4.3 Landing Page

| Element | Improvement |
|---------|-------------|
| Hero | Clear value prop, demo preview |
| Features | Icons, concise descriptions |
| CTA | Prominent "Get Started Free" button |
| Trust | Professional design, clear messaging |

---

## Phase 5: Google Analytics

**Goal:** Understand how users interact with the platform.

### Events to Track

| Event | When |
|-------|------|
| Page View | All pages (automatic) |
| Signup Started | User begins signup |
| Signup Completed | User finishes signup |
| Booking Started | User selects service |
| Booking Completed | Booking confirmed |
| Dashboard Visit | Owner visits dashboard |

### Setup

- GA4 property
- Measurement ID in frontend config
- No personal data in events

---

## Phase 6: Premium Coming Soon + Landing Updates

**Goal:** Prepare for future monetization without blocking launch.

### 6.1 Premium Teaser

Add to dashboard:

```
┌─────────────────────────────────────┐
│  Premium Features Coming Soon       │
│                                     │
│  • Multi-page website builder       │
│  • SEO optimization                 │
│  • Visitor analytics                │
│  • Custom domain                    │
│                                     │
│  [Join Waitlist]                    │
└─────────────────────────────────────┘
```

### 6.2 Landing Page Updates

| Section | Content |
|---------|---------|
| Hero | "Professional booking page. Free forever." |
| Features | Verified bookings, email notifications, QR codes, branding |
| How It Works | 3 simple steps with visuals |
| CTA | "Create Your Page in 5 Minutes" |

### 6.3 Waitlist

- Simple email collection for premium interest
- Store in database for future outreach

---

## Phase 7: Testing & Deployment

**Goal:** Ensure everything works before launch.

### Testing Checklist

- [ ] Owner signup with Google
- [ ] Owner signup with email + verification
- [ ] Owner login (both methods)
- [ ] Booker verification with Google
- [ ] Booker verification with email code
- [ ] All email types received correctly
- [ ] QR code generation + download
- [ ] Mobile experience (booking + dashboard)
- [ ] All existing features still work

### Deployment

- Deploy to Render (existing setup)
- Verify production environment
- Test with real email addresses

---

## Third-Party Services

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Resend | Transactional emails | 3,000/month |
| Google OAuth | Login with Google | Free |
| Google Analytics | Usage tracking | Free |
| Zoho Mail | Support email (optional) | 5 users |

---

## Environment Variables (New)

### Backend

```
RESEND_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=...
FRONTEND_URL=...
```

### Frontend

```
VITE_GOOGLE_CLIENT_ID=...
VITE_GA_MEASUREMENT_ID=...
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Owner can sign up and verify | Works 100% |
| Booker can verify and book | Works 100% |
| Emails delivered | > 95% delivery rate |
| Mobile usability | Fully functional |
| Page load time | < 3 seconds |

---

## Estimated Timeline

| Phase | Days |
|-------|------|
| 1. Auth & Verification | 3-4 |
| 2. Email Notifications | 2 |
| 3. QR Code | 0.5 |
| 4. Visual Polish | 2 |
| 5. Google Analytics | 0.5 |
| 6. Premium + Landing | 1 |
| 7. Testing + Deploy | 1 |
| **Total** | **~10 days** |
