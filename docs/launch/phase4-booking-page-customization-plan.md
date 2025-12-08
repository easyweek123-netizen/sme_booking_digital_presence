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
| **About Tab** | 5000 chars, textarea with markdown support |
| **Contact Info** | In header (existing location - unchanged) |
| **List Layout** | Professional service cards |

---

## Content Limits

| Field | Limit | Format |
|-------|-------|--------|
| Business Description | 150 words | Plain text (existing) |
| Service Description | 150 words | Plain text |
| About Section | 5000 chars | Textarea + markdown |

### Markdown Support (About Section)

Supported syntax:
- `**bold**` → **bold**
- `*italic*` → *italic*
- `- item` → bullet list
- `[link](url)` → clickable link
- Line breaks preserved

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

```
┌─────────────────────────────────────────────────────────┐
│  About Us                                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome to Salon Nadia!                                │
│                                                         │
│  We've been serving the Vienna community since 2015.    │
│  Our team of experienced stylists specializes in:       │
│                                                         │
│  • Color transformations                                │
│  • Precision cuts                                       │
│  • Bridal styling                                       │
│                                                         │
│  Visit us to experience personalized care in a          │
│  relaxing atmosphere.                                   │
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

Add fields:

```typescript
@Column({ type: 'varchar', length: 500, nullable: true })
coverImageUrl: string | null;

@Column({ type: 'text', nullable: true })
aboutContent: string | null;
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `backend/src/services/entities/service-category.entity.ts` | Category entity |
| `frontend/src/components/Booking/BookingTabs.tsx` | Tab navigation |
| `frontend/src/components/Booking/ServicesTab.tsx` | Categorized services list |
| `frontend/src/components/Booking/AboutTab.tsx` | About content with markdown |
| `frontend/src/components/Booking/ServiceCard.tsx` | Service card with image |
| `frontend/src/utils/markdown.ts` | Simple markdown parser |

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
- About tab with markdown rendering
- Simple markdown parser utility
- About section editor in dashboard

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
- [ ] About content renders markdown properly
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

