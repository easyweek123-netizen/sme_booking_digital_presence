# BookEasy - Launch Plan

**Created:** April 2026
**Author:** Product & Engineering
**Status:** Active

---

## Strategy

Ship a polished, fully free product. Build a user base. Monetize later.

```
Build & Polish → Launch Free (all channels) → Grow User Base → Monetize (Pro tier + IT services)
```

### Revenue Priority (When the Time Comes)

1. **Primary:** Pro subscriptions (scalable, passive income)
2. **Secondary:** IT service / web development projects via pricing page CTA

### What We Are NOT Doing Now

- No payment integration (Stripe deferred)
- No feature gating (everything is free)
- No Finanzamt registration or tax setup
- No new AI tools beyond current (driven by user feedback later)
- No Google Calendar integration (post-launch)

---

## Phase 1: Build & Polish (Current)

Everything below must be done before launching to real users.

### 1.1 Product Polish (Fix Corner Cases)

Full end-to-end audit of the user journey:

**Onboarding:**
- Conversational onboarding completes and creates business correctly
- Edge cases: going back, refreshing mid-flow, duplicate business creation
- Post-onboarding redirect to dashboard works

**Dashboard:**
- Overview page loads with correct stats
- QR code and booking link work
- All sidebar navigation links function
- Empty states are handled (no bookings, no services, no clients)

**Public Booking Page:**
- Loads by slug correctly
- Service selection, date/time picking, form submission all work
- Availability respects working hours and existing bookings
- Email notifications fire (or gracefully degrade if Resend not configured)

**AI Chat / Canvas:**
- Chat loads and responds
- Service management tools work through chat
- Canvas panel renders on desktop, mobile tabs work on phone
- Fix: chat history is in-memory and lost on restart -- move to database

### 1.2 Security Fixes

Must be fixed before real users touch the app:

- **FeedbackController** -- `GET /api/feedback` returns all feedback with no auth guard. Add admin-only guard.
  - File: `backend/src/feedback/`
- **AdminModule** -- defaults to `dev-secret-123` for `ADMIN_SECRET`. Fail loudly if not set in production.
  - File: `backend/src/admin/`
- **Chat history** -- stored in-memory `Map` in `ChatService`. Lost on every restart. Move to a `chat_messages` database table.
  - File: `backend/src/chat/chat.service.ts`

### 1.3 German i18n (Internationalization)

Add dual-language support (English + German). German is essential for local outreach in Linz/Austria and DACH SEO.

**Approach:** `react-i18next`

**What to translate (public-facing pages first):**
- Landing page (hero, how it works, FAQ, CTA)
- Pricing page (cards, features, contact form)
- Public booking page (service list, booking form, confirmation)
- Legal pages (Privacy Policy, Terms, Impressum)
- Onboarding flow

**Dashboard stays English initially** -- practitioners who sign up can navigate English UI.

**Language switcher:** DE/EN toggle in the header or footer.

**Files:**
- New: `frontend/src/i18n/en.json`, `frontend/src/i18n/de.json`, `frontend/src/i18n/index.ts`
- Modified: `frontend/src/main.tsx` (add I18nextProvider)
- Modified: all public-facing components (replace hardcoded strings with `t()` calls)

### 1.4 Bare Minimum Legal

Required by Austrian law even for a free product with commercial intent (IT services CTA = commercial):

**Impressum page** (required by ECG §5):
- Your name, city (Linz), email, nature of activity
- New route: `/impressum`
- File: new `frontend/src/pages/legal/Impressum.tsx`
- Add link in Footer

**Privacy Policy update:**
- Current page exists but needs real information
- Data controller: your name and email
- Data collected: name, email, phone (bookings), Firebase auth tokens
- Third parties: Google (Firebase), Resend (email), Groq/OpenAI (AI chat)
- User rights under GDPR: access, deletion, portability, complaint to Austrian DSB
- File: `frontend/src/pages/legal/PrivacyPolicy.tsx`

**Cookie consent banner:**
- Firebase sets cookies
- Add a lightweight consent component on first visit
- File: new component in `frontend/src/components/`

**Both Impressum and Privacy Policy should be available in EN + DE.**

### 1.5 Pricing Page Restructure

Redesign from 2 cards to 3 cards:

| Card | Label | Features | CTA |
|------|-------|----------|-----|
| **Free** | "Free" (no currency) | Professional booking page, unlimited services, unlimited bookings, email notifications, QR code, branding, categories, verified bookings, working hours | "Get Started Free" → onboarding |
| **Premium** | "Coming Soon" | Everything in Free + custom domain, analytics, SEO tools, remove branding, priority support | "Get Notified" → scrolls to form |
| **Custom Software** | "Let's Talk" | Web development, AI-powered solutions, mobile apps, system integrations, tailored to your business | "Contact Us" → scrolls to form |

**Contact form:** Extend existing `FeedbackForm` component to handle both product feedback and IT service inquiries. Add a topic/type selector.

**Files:**
- `frontend/src/pages/pricing/index.tsx` -- add third card, remove "$0", update features
- `frontend/src/components/Pricing/PricingCard.tsx` -- variant for Custom Software card
- `frontend/src/components/Pricing/FeedbackForm.tsx` -- extend for IT inquiries

### 1.6 SEO Foundation

Needed for organic search traffic (results in 3-6 months, but must be set up at launch):

- Meta tags on all pages (`<title>`, `<meta description>`, Open Graph for social sharing)
- `sitemap.xml` in `frontend/public/`
- `robots.txt` in `frontend/public/`
- Structured data (JSON-LD SoftwareApplication schema) on landing page
- Keyword-optimized headings (EN + DE) on landing page

**Target keywords:**
- "online terminbuchung kostenlos" (free online appointment booking)
- "buchungsseite erstellen" (create booking page)
- "booking page for massage therapist"
- "free booking system wellness"

### 1.7 Landing Page & Footer Polish

- Update hero carousel copy to be more niche-specific (wellness practitioners)
- Add "Built by [Name] | Custom Software Development" in footer with link to `/pricing`
- Ensure "Powered by BookEasy" appears on public booking pages (viral loop)
- Ensure Pricing link in header navbar works
- Mobile responsiveness pass on all pages

### 1.8 Demo Video

Record a 30-60 second screen recording showing:
1. Sign up with Google (2 seconds)
2. Conversational onboarding ("I'm a massage therapist...")
3. Live booking page appears with QR code
4. Client books an appointment on the public page
5. Owner sees it in dashboard

Used for: Product Hunt, social media, landing page, LinkedIn.

---

## Phase 2: Launch (All Channels Simultaneously)

### Launch Day Checklist

- [ ] All Phase 1 items complete
- [ ] App deployed to Render (free tier acceptable for free product)
- [ ] German language available
- [ ] Legal pages live (Impressum, Privacy Policy, Terms)
- [ ] Pricing page with 3 cards live
- [ ] Demo video ready
- [ ] Product Hunt listing drafted
- [ ] Social media posts drafted
- [ ] List of 20+ Linz wellness businesses to visit

### Acquisition Channels

**Channel 1: Local Outreach in Linz (fastest results)**
- Walk into massage studios, yoga places, wellness centers, physiotherapy practices
- Demo on your phone, offer to set them up on the spot
- Expected: 10 visits/week = 3-5 signups
- Time to first users: 1-2 weeks

**Channel 2: SEO + Content (slow but compounding)**
- Landing page optimized with keywords (EN + DE)
- Structured data for search engines
- Optional: blog posts targeting practitioner searches
- Time to organic traffic: 3-6 months

**Channel 3: Social Media + Communities**
- LinkedIn: post about the journey, B2B audience
- Instagram/TikTok: short demo videos (30-60 sec)
- Facebook groups: Austrian freelancer/wellness groups (German)
- Reddit: r/smallbusiness, r/SaaS, r/EntrepreneurRideAlong
- Time to engagement: 1-2 weeks

**Channel 4: Product Hunt (one-time spike)**
- Prepare: logo, tagline, description, screenshots, demo video
- Launch on Tuesday or Wednesday (highest traffic)
- Expected: 200-1000 visitors on launch day
- Ask network to upvote

**Channel 5: Built-In Viral Loop (compounding)**
- Every public booking page shows "Powered by BookEasy"
- Practitioners share their link with 50+ clients/month
- Each client sees your brand
- Time to effect: 1-3 months (needs active users first)

### Week-by-Week Launch Playbook

| Day | Activity |
|-----|----------|
| Day 1 | Deploy. Post on LinkedIn. Share in JKU network. |
| Day 2-3 | Visit 5-10 wellness businesses in Linz. |
| Day 4 | Launch on Product Hunt. |
| Day 5-7 | Post demo video on Instagram/TikTok. Share in Facebook groups. Reddit posts. |
| Week 2 | Continue local outreach (10 more businesses). Follow up with signups. |
| Week 3+ | Weekly: 3-4 social posts, 5-8 local visits, community engagement, user support. |

### Metrics to Track

| Metric | Target (Month 1) | Target (Month 3) |
|--------|-------------------|-------------------|
| Signups | 20-30 | 100+ |
| Active booking pages | 10-15 | 50+ |
| Bookings made by clients | 30-50 | 200+ |
| Website visitors | 500+ | 2,000+ |
| Contact form submissions | 2-5 | 10+ |

---

## Phase 3: Monetize (Deferred)

**Trigger:** Move to Phase 3 when:
- 50+ active free users
- Clear demand for Pro features
- Visa/legal situation allows commercial activity

### 3.1 Legal Setup (When Revenue is Imminent)

1. Register Gewerbeschein at WKO Linz
2. Open Wise Business account (IBAN for EU payments)
3. Integrate Stripe for subscription payments
4. Ensure visa/residence permit allows self-employment

### 3.2 Pro Tier

- Price: TBD based on user feedback (estimated 9-19 EUR/month)
- Features to gate: AI assistant, remove branding, custom domain, analytics
- Stripe Checkout + webhooks + Customer Portal
- Feature gating in backend

### 3.3 IT Services (Secondary)

- Custom software inquiries from pricing page contact form
- Outsource or build through developer network
- Deal with each opportunity case-by-case

### 3.4 Hosting Upgrade

- Move backend to Render Starter ($7/mo) or Railway (~$5/mo) to eliminate 30s cold starts
- Paying users expect instant response

---

## Cost Summary

### Phase 1-2 (Free Launch)

| Item | Cost |
|------|------|
| Hosting (Render free tier) | 0 EUR/mo |
| Resend (email) | Free (up to 3,000/mo) |
| Firebase Auth | Free (up to 50k MAU) |
| AI (Groq) | Free tier |
| Domain (optional) | 0-1 EUR/mo |
| **Total** | **0 EUR/mo** |

### Phase 3 (After Monetization)

| Item | Cost |
|------|------|
| Hosting upgrade | ~7 EUR/mo |
| Domain | ~1 EUR/mo |
| Stripe fees | 1.4% + 0.25 EUR/transaction |
| Wise Business | Free (per-transaction fees only) |
| **Total** | ~8 EUR/mo + transaction fees |

---

## Key Files Reference

| Area | Files |
|------|-------|
| Pricing page | `frontend/src/pages/pricing/index.tsx`, `frontend/src/components/Pricing/` |
| Legal pages | `frontend/src/pages/legal/` (Privacy, Terms, new Impressum) |
| Landing page | `frontend/src/components/Landing/` |
| Footer | `frontend/src/components/Layout/Footer.tsx` |
| SEO | `frontend/index.html`, `frontend/public/sitemap.xml`, `frontend/public/robots.txt` |
| i18n | `frontend/src/i18n/` (new) |
| Security | `backend/src/feedback/`, `backend/src/admin/`, `backend/src/chat/chat.service.ts` |
| Routing | `frontend/src/App.tsx` |
