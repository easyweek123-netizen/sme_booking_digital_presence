# Phase 4: Booking Page Customization - Implementation Plan

## Vision

> "Add your services, and you have a page that looks like you paid a designer."

---

## Key Principle

**Everything above the tabs stays exactly as it is today** - we only:
1. Make the gradient area uploadable as a cover image
2. Add tabs below the existing business info section

---

## Page Layouts

### Mobile Layout

```
┌─────────────────────────────────────────┐
│  BookEasy Logo                          │
├─────────────────────────────────────────┤
│                                         │
│         Cover Image                     │  ← NEW: uploadable
│      (or existing gradient fallback)    │
│                                         │
├─────────────────────────────────────────┤
│  [Logo]  Business Name                  │
│          Description                    │
│          📍 City · 📞 Phone             │
│          🌐 Website · 📷 Instagram      │  ← EXISTING: unchanged
│          ▼ Working Hours                │
│          ▼ Check Booking Status         │  ← EXISTING: keep this!
├─────────────────────────────────────────┤
│     Services     │     About            │  ← NEW: tabs
├─────────────────────────────────────────┤
│                                         │
│  [Tab Content]                          │
│                                         │
├─────────────────────────────────────────┤
│        Powered by BookEasy              │
└─────────────────────────────────────────┘
```

### Desktop Layout (Split View)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  BookEasy Logo                                                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │                            │  │                                    │  │
│  │       Cover Image          │  │    Services    │    About          │  │
│  │    (or gradient fallback)  │  ├────────────────────────────────────┤  │
│  │                            │  │                                    │  │
│  ├────────────────────────────┤  │  Category: Hair Services      ▼   │  │
│  │                            │  │  ┌──────────────────────────────┐  │  │
│  │  [Logo]                    │  │  │ Haircut                      │  │  │
│  │  Business Name             │  │  │ Classic cut with wash...     │  │  │
│  │  Description text here     │  │  │ 45 min · $35      [Book Now] │  │  │
│  │                            │  │  └──────────────────────────────┘  │  │
│  │  ─────────────────────     │  │  ┌──────────────────────────────┐  │  │
│  │  📍 Vienna, Austria        │  │  │ Blowout                      │  │  │
│  │  📞 +43 123 456 789        │  │  │ Professional styling...      │  │  │
│  │  🌐 Website                │  │  │ 30 min · $25      [Book Now] │  │  │
│  │  📷 @salonnadia            │  │  └──────────────────────────────┘  │  │
│  │                            │  │                                    │  │
│  │  ─────────────────────     │  │  Category: Color Services     ▼   │  │
│  │  ▼ Working Hours           │  │  ┌──────────────────────────────┐  │  │
│  │  ▼ Check Booking Status    │  │  │ Balayage                     │  │  │
│  │                            │  │  │ Hand-painted highlights...   │  │  │
│  │                            │  │  │ 2h 30min · $150  [Book Now]  │  │  │
│  └────────────────────────────┘  │  └──────────────────────────────┘  │  │
│         ↑                        │                                    │  │
│    Sticky on scroll              └────────────────────────────────────┘  │
│    (optional enhancement)                                                │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                         Powered by BookEasy                              │
└──────────────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| Mobile (<768px) | Single column, stacked |
| Desktop (≥768px) | Split view (left: info, right: tabs) |

---

## FREE Tier Features

| Feature | Details |
|---------|---------|
| **Cover Image** | Upload custom image OR auto-gradient from brand color |
| **Logo** | Upload OR auto-generated initial |
| **Brand Color** | Color picker (existing) |
| **2 Tabs** | Services (default), About |
| **Service Categories** | Group services with collapsible sections |
| **Service Images** | Optional per service, icon/initial fallback |
| **Service Description** | 150 words max, plain text |
| **About Tab** | 5000 chars, HTML content (sanitized) |
| **Contact Info** | In header (existing location - unchanged) |
| **List Layout** | Professional service cards |

---

## Content Limits

| Field | Limit | Format | Status |
|-------|-------|--------|--------|
| Business Description | 150 words | Plain text | ✅ Existing |
| Service Description | 150 words | Plain text | ✅ Existing |
| About Section | 5000 chars | HTML (sanitized) | 🆕 New |

### HTML Support (About Section)

The About tab stores and renders sanitized HTML for visual richness.

**Allowed HTML tags:**
- `<h2>`, `<h3>`, `<h4>` - Headings
- `<p>`, `<br>` - Paragraphs
- `<strong>`, `<em>` - Bold, italic
- `<ul>`, `<ol>`, `<li>` - Lists
- `<blockquote>` - Quotes
- `<a>` - Links (with rel="noopener")

**Security:** Use DOMPurify to sanitize before rendering.

**Editor:** Simple textarea with HTML preview (upgrade to rich editor later).

---

## Service Card Design

### With Image

```
┌─────────────────────────────────────────────────────────┐
│  ┌────────┐                                             │
│  │        │  Haircut                                    │
│  │  IMG   │                                             │
│  │        │  Classic cut with wash and style. Includes  │
│  └────────┘  consultation to find your perfect look.    │
│                                                         │
│              45 min · $35                   [Book Now]  │
└─────────────────────────────────────────────────────────┘
```

### Without Image (Icon Fallback)

```
┌─────────────────────────────────────────────────────────┐
│  ┌────────┐                                             │
│  │   ✂️   │  Haircut                                    │
│  │        │                                             │
│  │   H    │  Classic cut with wash and style. Includes  │
│  └────────┘  consultation to find your perfect look.    │
│                                                         │
│              45 min · $35                   [Book Now]  │
└─────────────────────────────────────────────────────────┘
```

The icon/initial fallback uses brand color as background.

---

## About Tab Content

### Stored HTML Example

```html
<h2>Welcome to VisionSoulArt</h2>

<p><em>Farben, Frequenzen und Raum für deine Transformation</em></p>

<p>Ich begleite dich dabei, emotionale Blockaden zu lösen und 
deine Lebenskraft, Kreativität und Intuition zu stärken.</p>

<h3>Meine Methoden</h3>
<ul>
  <li>🌿 Craniosakrales Balancing</li>
  <li>🎨 Kreativ Workshops & Malkurse</li>
  <li>🔔 Kakao, Klang & Farb-Zeremonie</li>
</ul>

<blockquote>
  "Eine transformative Erfahrung, die mich zu mir selbst zurückgebracht hat"
</blockquote>
```

### Rendered Result

```
┌─────────────────────────────────────────────────────────┐
│  About                                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome to VisionSoulArt                               │
│  ════════════════════════                               │
│                                                         │
│  𝘍𝘢𝘳𝘣𝘦𝘯, 𝘍𝘳𝘦𝘲𝘶𝘦𝘯𝘻𝘦𝘯 𝘶𝘯𝘥 𝘙𝘢𝘶𝘮 𝘧ü𝘳 𝘥𝘦𝘪𝘯𝘦 𝘛𝘳𝘢𝘯𝘴𝘧𝘰𝘳𝘮𝘢𝘵𝘪𝘰𝘯  │
│                                                         │
│  Ich begleite dich dabei, emotionale Blockaden          │
│  zu lösen und deine Lebenskraft, Kreativität            │
│  und Intuition zu stärken.                              │
│                                                         │
│  Meine Methoden                                         │
│  ────────────────                                       │
│  • 🌿 Craniosakrales Balancing                          │
│  • 🎨 Kreativ Workshops & Malkurse                      │
│  • 🔔 Kakao, Klang & Farb-Zeremonie                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ "Eine transformative Erfahrung, die mich zu     │    │
│  │  mir selbst zurückgebracht hat"                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Database Changes

### New Entity: ServiceCategory

```typescript
@Entity('service_categories')
export class ServiceCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  businessId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];
}
```

### Update: Service Entity

Add fields:

```typescript
@Column({ nullable: true })
categoryId: number | null;

@Column({ type: 'varchar', length: 500, nullable: true })
imageUrl: string | null;

@Column({ type: 'int', default: 0 })
displayOrder: number;

@ManyToOne(() => ServiceCategory, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'categoryId' })
category: ServiceCategory | null;
```

### Update: Business Entity

Add 2 new fields (description already exists):

```typescript
// Existing: description - used for short text under business name

// NEW fields only:
@Column({ type: 'varchar', length: 500, nullable: true })
coverImageUrl: string | null;

@Column({ type: 'text', nullable: true })
aboutContent: string | null;  // HTML content, sanitized with DOMPurify
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `backend/src/services/entities/service-category.entity.ts` | Category entity |
| `frontend/src/components/Booking/BookingTabs.tsx` | Tab navigation |
| `frontend/src/components/Booking/ServicesTab.tsx` | Categorized services list |
| `frontend/src/components/Booking/AboutTab.tsx` | About content with HTML rendering |
| `frontend/src/components/Booking/ServiceCard.tsx` | Service card with image |

## Files to Modify

| File | Changes |
|------|---------|
| `backend/src/services/entities/service.entity.ts` | Add categoryId, imageUrl, displayOrder |
| `backend/src/business/entities/business.entity.ts` | Add coverImageUrl, aboutContent |
| `backend/src/services/services.service.ts` | Category CRUD, ordering |
| `frontend/src/pages/booking/index.tsx` | Add cover image, tabs, split layout |
| `frontend/src/pages/dashboard/DashboardSettings.tsx` | Cover upload, about editor |
| `frontend/src/pages/dashboard/DashboardServices.tsx` | Category management, service images |

---

## Implementation Phases

### Phase 1: Backend Schema (1 day)
- Create ServiceCategory entity
- Add fields to Service (categoryId, imageUrl, displayOrder)
- Add fields to Business (coverImageUrl, aboutContent)
- Update DTOs for all entities
- Category CRUD endpoints

### Phase 2: Service Cards & Categories (2 days)
- ServiceCard component with image/icon fallback
- Category grouping with collapsible sections
- Category management UI in dashboard
- Service image upload
- Service ordering within categories

### Phase 3: Tabs & About (2 days)
- Tab navigation component (Services / About)
- Services tab with categorized list
- About tab with HTML rendering (DOMPurify sanitization)
- About section editor in dashboard (textarea + preview)

### Phase 4: Cover Image & Layout (1 day)
- Cover image upload in settings
- Cover display on booking page
- Gradient fallback when no image
- Desktop split layout implementation

**Total: ~6 days**

---

## Success Criteria

- [ ] Cover image displays beautifully (or gradient fallback)
- [ ] Desktop shows split layout (info left, tabs right)
- [ ] Mobile shows stacked layout
- [ ] Services organized by categories (collapsible)
- [ ] Service cards show images or nice icon fallback
- [ ] Tabs switch between Services and About
- [ ] About content renders HTML properly (sanitized)
- [ ] Existing features preserved (working hours, booking status check)
- [ ] All editable from dashboard
- [ ] Mobile-first, works on all devices

---

## PREMIUM Features (Future)

| Feature | Details |
|---------|---------|
| **Contact Tab** | Dedicated tab with interactive map |
| **Photo Gallery** | Up to 20 images in About tab |
| **Testimonials** | Customer reviews section |
| **Custom Fonts** | Typography options |
| **Theme Presets** | Light/Dark/Warm modes |
| **Remove Branding** | No "Powered by BookEasy" footer |
| **Custom Domain** | yourbusiness.com |
| **LLM Features** | Auto-generate descriptions, SEO |

---

## Test Persona: VisionSoulArt Onboarding Guide

Use this guide to verify the implementation works for creative/artistic users.

### Persona Profile

| Attribute | Value |
|-----------|-------|
| **Business Name** | VisionSoulArt |
| **Type** | Wellness / Life Coach / Healer |
| **Location** | Vienna, Austria |
| **Brand Color** | #8B7355 (earthy brown) |
| **Website** | visionsoulart.com |
| **Instagram** | @visionsoulart |

### Step 1: Onboarding Wizard

#### Business Profile
- **Name:** VisionSoulArt
- **Description:** "Entdecke die Kraft von Kreativität und Intuition – gestaltet für hochsensible und feinfühlige Menschen."
- **Phone:** +43 123 456 789
- **City:** Vienna, Austria
- **Address:** Deinhardsteingasse

#### Branding
- **Logo:** Upload VisionSoulArt logo
- **Brand Color:** #8B7355
- **Cover Image:** Upload a ceremony/nature photo

#### Services to Add

**Category: Zeremonien**
| Service | Duration | Price | Description |
|---------|----------|-------|-------------|
| Kakao, Klang und Farbe Zeremonie | 210 min | €60 | Erlebe eine Kakao Zeremonie in Wien und komm in Verbindung mit den Elementen und deiner Kreativität. |

**Category: Balancing & Healing**
| Service | Duration | Price | Description |
|---------|----------|-------|-------------|
| Craniosakrales Balancing | 90 min | €80 | Durch leichte Berührung bringe ich Prozesse in Gang, die von selbst zur Ruhe kommen. |
| Innere Reise / Journey | 120 min | €100 | Entdecke tieferliegende Themen und lass sie los. |

**Category: Workshops**
| Service | Duration | Price | Description |
|---------|----------|-------|-------------|
| Kreativ Workshop | 180 min | €55 | Intuitives Malen und kreatives Gestalten in entspannter Atmosphäre. |

### Step 2: Dashboard - Add About Content

In Settings → About Section, enter this HTML:

```html
<h2>Willkommen bei VisionSoulArt</h2>

<p><em>Farben, Frequenzen und Raum für deine Transformation</em></p>

<p>Ich begleite dich dabei, emotionale Blockaden zu lösen und deine Lebenskraft, Kreativität und Intuition zu stärken.</p>

<h3>Meine Methoden</h3>
<ul>
  <li>🌿 Craniosakrales Balancing</li>
  <li>🎨 Kreativ Workshops & Malkurse in Wien</li>
  <li>🔔 Kakao, Klang & Farb-Zeremonie</li>
  <li>✨ Innere Reisen nach der Journey-Methode</li>
</ul>

<h3>Eine Session bei mir ist für DICH, wenn du...</h3>
<ul>
  <li>zurück in deine Kraft und in dein Strahlen kommen möchtest</li>
  <li>körperliche, emotionale, seelische Blockaden lösen möchtest</li>
  <li>tieferliegende oder unbewusste Themen verabschieden möchtest</li>
  <li>deine Seelenaufgabe entdecken möchtest</li>
</ul>

<blockquote>
  "Nur durch leichte Berührung bringt Johanna Prozesse in Gang, die so real sind wie eine Fahrt in der Achterbahn, dann aber auf wundersame Weise von selbst zur Ruhe kommen."
</blockquote>

<p>Ich freue mich auf dich!</p>
```

### Step 3: Verify Booking Page

Navigate to `/book/visionsoulart` and verify:

- [ ] Cover image displays (or earthy gradient fallback)
- [ ] Logo and business name show correctly
- [ ] Description appears under business name
- [ ] Contact info (phone, city, website, Instagram) visible
- [ ] Working hours toggle works
- [ ] Booking status check works
- [ ] **Services tab** shows 3 categories (Zeremonien, Balancing, Workshops)
- [ ] Categories are collapsible
- [ ] Service cards show image or icon fallback with brand color
- [ ] Service descriptions display
- [ ] Book Now buttons work
- [ ] **About tab** renders HTML beautifully
- [ ] Headings, lists, blockquote styled properly
- [ ] Desktop shows split layout
- [ ] Mobile shows stacked layout

### Expected Final Result

```
┌─────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  ░░░ Ceremony/nature cover image ░░░   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
├─────────────────────────────────────────┤
│  [Logo]  VisionSoulArt                  │
│                                         │
│  Entdecke die Kraft von Kreativität     │
│  und Intuition – gestaltet für          │
│  hochsensible und feinfühlige Menschen. │
│                                         │
│  📍 Vienna · 📞 +43 123 456 789         │
│  🌐 visionsoulart.com · 📷 @visionsoulart│
│  ▼ Working Hours                        │
│  ▼ Check Booking Status                 │
├─────────────────────────────────────────┤
│     Services     │     About            │
├─────────────────────────────────────────┤
│                                         │
│  Zeremonien                        ▼    │
│  ┌─────────────────────────────────┐    │
│  │ Kakao, Klang und Farbe          │    │
│  │ Zeremonie                       │    │
│  │                                 │    │
│  │ Erlebe eine Kakao Zeremonie...  │    │
│  │ 3h 30min · €60      [Book Now]  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Balancing & Healing               ▼    │
│  ┌─────────────────────────────────┐    │
│  │ Craniosakrales Balancing        │    │
│  │ 90 min · €80        [Book Now]  │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Innere Reise / Journey          │    │
│  │ 2h · €100           [Book Now]  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Workshops                         ▼    │
│  ┌─────────────────────────────────┐    │
│  │ Kreativ Workshop                │    │
│  │ 3h · €55            [Book Now]  │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│        Powered by BookEasy              │
└─────────────────────────────────────────┘
```

