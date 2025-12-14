# BookEasy: Launch Plan

**Last Updated:** December 12, 2024

## Vision

Launch a **professional booking platform** that helps SMEs create beautiful booking pages and start accepting appointments.

---

## Product Tiers

```
FREE VERSION                          PREMIUM (Coming Soon)
────────────                          ────────────────────
✓ Professional booking page            ○ Multi-page website builder
✓ Logo + brand color                   ○ Advanced SEO
✓ Cover image + About section          ○ Visitor analytics  
✓ Unlimited services                   ○ Custom domain
✓ Unlimited bookings                   ○ Remove BookEasy branding
✓ Email notifications                  ○ Priority support
✓ QR code for sharing
✓ Verified bookings (Google)
✓ Service categories
✓ Working hours + contact links
```

---

## Completed Phases

### Phase 1: Authentication & Verification ✅

- Google OAuth for owners and bookers
- Firebase Authentication integration
- Customer records in database
- Booking reference codes for status checking

**Summary:** [phase1-summary.md](./phase1-summary.md)

---

### Phase 2: Email Notifications ✅

- Booking confirmation emails
- New booking alerts to owners
- Booking cancelled/completed emails
- Resend integration
- Professional email templates

**Summary:** [phase2-email-summary.md](./phase2-email-summary.md)

---

### Phase 3: QR Code Generation ✅

- QR code display on dashboard
- High-resolution PNG download
- Booking link with copy button

**Summary:** [phase3-qr-code-summary.md](./phase3-qr-code-summary.md)

---

### Phase 4: Booking Page Customization ✅

- Cover image upload
- Service categories with grouping
- About tab with HTML support
- Service descriptions and images
- Desktop/mobile split layouts
- Brand color integration

**Summary:** [phase4-summary.md](./phase4-summary.md)

---

### Phase 5: UI Polish ✅

**Goal:** Make landing page catchy and professional, clearly communicate value.

| Task | Status | Implementation |
|------|--------|----------------|
| Hero Rewrite | ✅ Done | `HeroCarousel.tsx` - Animated color carousel with 4 slides |
| How It Works | ✅ Done | `HowItWorks.tsx` - 4-step visual guide |
| FAQ Section | ✅ Done | `FAQ.tsx` - Collapsible accordion |
| CTA Optimization | ✅ Done | `CTASection.tsx` - Updated copy |
| Trust Badges | ✅ Done | In HeroCarousel - "No credit card", "Free forever", "2 min setup" |
| Tour System | ✅ Done | `TourContext.tsx` - Welcome tour for new users |
| Legal Pages | ✅ Done | Terms of Service, Privacy Policy |

**Detailed Plan:** [phase5-ui-polish.md](./phase5-ui-polish.md)

---

## Current Phase

### Phase 6: Production & AI Integration 🔄

**Goal:** Prepare for production launch and add AI-powered onboarding.

#### Priority 1: Production Planning & Features

| Task | Status | Notes |
|------|--------|-------|
| Optional Services | ✅ Done | Services form open by default, skip allowed |
| Live/Not Live Toggle | ⏳ Next | Allow owners to hide booking page until ready |
| Production Plan | ⏳ Pending | Environment setup, deployment strategy |
| Pre-Launch Testing | ⏳ Pending | Full flow verification |
| Custom Domain | ⏳ Pending | Deploy to professional domain |

#### Priority 2: AI Integration

| Task | Status | Notes |
|------|--------|-------|
| AI Service Generator | ⏳ Pending | Generate services based on business type |
| AI Description Writer | ⏳ Pending | Auto-generate business descriptions |
| Smart Defaults | ⏳ Pending | Pre-fill based on business type |

#### Priority 3: Analytics (Last)

| Task | Status | Notes |
|------|--------|-------|
| Google Analytics | ⏳ Future | GA4 setup with event tracking |
| Real User Testing | ⏳ Pending | VisionSoulArt persona test |

**Detailed Plan:** [phase7-launch.md](./phase7-launch.md)

---

## Future Phase

### Phase 7: AI Onboarding 📋

**Goal:** Reduce onboarding time using AI. To be implemented after launch.

| Feature | Status | Description |
|---------|--------|-------------|
| AI Service Generator | 📋 Planned | Generate services based on business type |
| AI Description Writer | 📋 Planned | Auto-generate business descriptions |
| Smart Defaults | 📋 Planned | Pre-fill working hours, pricing |

**Detailed Plan:** [phase6-ai-onboarding.md](./phase6-ai-onboarding.md)

---

## Timeline

| Phase | Status | Est. Days |
|-------|--------|-----------|
| 1. Auth & Verification | ✅ Done | - |
| 2. Email Notifications | ✅ Done | - |
| 3. QR Code | ✅ Done | - |
| 4. Booking Customization | ✅ Done | - |
| 5. UI Polish | ✅ Done | - |
| 6. Analytics & Launch | 🔄 Current | 1-2 |
| 7. AI Onboarding | 📋 Future | TBD |
| **Total to Launch** | | **~1-2 days** |

---

## Production Checklist

### Pre-Launch Verification

| Category | Check | Status |
|----------|-------|--------|
| **Auth Flow** | Google OAuth signup works | ⏳ |
| **Auth Flow** | Google OAuth login works | ⏳ |
| **Auth Flow** | Logout clears session | ⏳ |
| **Onboarding** | Profile step saves data | ⏳ |
| **Onboarding** | Services step works (optional) | ⏳ |
| **Onboarding** | Business created on completion | ⏳ |
| **Onboarding** | Redirect to dashboard | ⏳ |
| **Dashboard** | Overview loads correctly | ⏳ |
| **Dashboard** | QR code displays and downloads | ⏳ |
| **Dashboard** | Booking link copies | ⏳ |
| **Dashboard** | Services CRUD works | ⏳ |
| **Dashboard** | Settings update works | ⏳ |
| **Booking Page** | Public page loads | ⏳ |
| **Booking Page** | Service selection works | ⏳ |
| **Booking Page** | Date/time selection works | ⏳ |
| **Booking Page** | Customer verification works | ⏳ |
| **Booking Page** | Booking confirmation shows | ⏳ |
| **Emails** | New booking alert sent | ⏳ |
| **Emails** | Booking confirmation sent | ⏳ |
| **Mobile** | Landing page responsive | ⏳ |
| **Mobile** | Onboarding works on mobile | ⏳ |
| **Mobile** | Dashboard works on mobile | ⏳ |
| **Mobile** | Booking page works on mobile | ⏳ |
| **Console** | No errors in browser console | ⏳ |
| **Tour** | Welcome tour triggers for new users | ⏳ |

### Environment Setup

| Item | Status |
|------|--------|
| Production Firebase project | ⏳ |
| Production database | ⏳ |
| Production Resend API key | ⏳ |
| Custom domain DNS | ⏳ |
| SSL certificate | ⏳ |
| Environment variables | ⏳ |

---

## Third-Party Services

| Service | Purpose | Status |
|---------|---------|--------|
| Firebase | Authentication | ✅ Configured |
| Resend | Transactional emails | ✅ Configured |
| Google Analytics | Usage tracking | ⏳ Phase 6 |
| OpenAI | AI onboarding | 📋 Future |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Landing page clarity | Users understand value in 5 seconds |
| Onboarding completion | Users can complete setup |
| Mobile usability | Fully functional |
| Real user test | VisionSoulArt can use the app |

---

## AI Integration Planning (Phase 7)

### Overview

Use OpenAI to reduce onboarding friction by auto-generating services and descriptions.

### Technical Approach

```
User selects business type → API call to OpenAI → Generate services → User reviews/edits
```

### API Endpoints

| Endpoint | Input | Output |
|----------|-------|--------|
| `POST /api/ai/generate-services` | Business type, name | Array of 3-5 services |
| `POST /api/ai/generate-description` | Business type, name | 2-sentence description |

### Service Generation Prompt

```
Generate 4 services for a {businessType} called "{businessName}".
Each service should include:
- name: Professional service name
- durationMinutes: Typical duration (30, 60, 90, or 120)
- price: Reasonable market price in EUR
- description: 1-2 sentence description

Format: JSON array
```

### Implementation Steps

1. Add OpenAI SDK to backend
2. Create `/api/ai/` module
3. Add loading state in onboarding
4. Add "Generate with AI" button
5. Allow user to edit/accept suggestions
6. Add fallback if AI fails

### Cost Estimate

- GPT-4o-mini: ~$0.15/1M input, ~$0.60/1M output
- Per generation: ~$0.001 (negligible)

### Files to Create

```
backend/src/ai/
├── ai.module.ts
├── ai.controller.ts
├── ai.service.ts
└── dto/
    ├── generate-services.dto.ts
    └── generate-description.dto.ts

frontend/src/components/onboarding/
└── AIGenerateButton.tsx
```
