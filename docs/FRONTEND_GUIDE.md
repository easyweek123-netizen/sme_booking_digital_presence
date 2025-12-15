# BookEasy Frontend Coding Guide

This guide defines the coding standards and patterns for the BookEasy frontend. All contributors and AI agents must follow these conventions.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Patterns](#component-patterns)
3. [Styling with Chakra UI](#styling-with-chakra-ui)
4. [Icons](#icons)
5. [Reusable UI Components](#reusable-ui-components)
6. [Chat Components](#chat-components)
7. [Constants](#constants)
8. [State Management](#state-management)
9. [TypeScript Guidelines](#typescript-guidelines)
10. [Naming Conventions](#naming-conventions)
11. [DRY Principles](#dry-principles)
12. [Accessibility](#accessibility)

---

## Project Structure

```
frontend/src/
├── components/           # Reusable components
│   ├── icons/           # SVG icons as React components
│   ├── ui/              # Base UI components (Logo, PrimaryButton)
│   ├── chat/            # Reusable chat components
│   ├── Layout/          # Layout components (Header, Footer, SplitLayout)
│   ├── Landing/         # Landing page sections
│   ├── ConversationalOnboarding/  # Onboarding chat flow
│   └── BusinessCategories/
├── pages/               # Route pages (lazy loaded)
│   ├── landing/
│   ├── login/
│   ├── onboarding/
│   ├── dashboard/
│   └── booking/
├── store/               # Redux store
│   ├── api/             # RTK Query API slices
│   └── slices/          # Redux slices
├── constants/           # App constants
├── config/              # Configuration (routes, env)
├── theme/               # Chakra UI theme
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── utils/               # Utility functions
```

### File Placement Rules

| Type | Location | Example |
|------|----------|---------|
| Page components | `pages/{page-name}/index.tsx` | `pages/landing/index.tsx` |
| Reusable UI | `components/ui/` | `components/ui/Logo.tsx` |
| Chat components | `components/chat/` | `components/chat/ChatMessage.tsx` |
| Layout components | `components/Layout/` | `components/Layout/Header.tsx` |
| Feature components | `components/{Feature}/` | `components/BusinessCategories/` |
| Icons | `components/icons/index.tsx` | Single file, all icons |
| API calls | `store/api/{domain}Api.ts` | `store/api/businessApi.ts` |
| Types | `types/{domain}.types.ts` | `types/business.types.ts` |

---

## Component Patterns

### Function Components

Always use function components with explicit return types:

```tsx
// ✅ Good
export function MyComponent({ title }: MyComponentProps) {
  return <Box>{title}</Box>;
}

// ❌ Bad - arrow function for components
export const MyComponent = ({ title }: MyComponentProps) => {
  return <Box>{title}</Box>;
};
```

### Component File Structure

```tsx
// 1. Imports (external, then internal)
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ROUTES } from '../../config/routes';
import { SECTION_PADDING } from '../../constants';

// 2. Motion components (if needed)
const MotionBox = motion.create(Box);

// 3. Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

// 4. Sub-components (if small and only used here)
function SubComponent({ label }: { label: string }) {
  return <Text>{label}</Text>;
}

// 5. Main component (exported)
export function MyComponent({ title, onAction }: MyComponentProps) {
  const navigate = useNavigate();
  
  return (
    <Box>
      <SubComponent label={title} />
    </Box>
  );
}
```

### Index Files for Exports

Each component folder should have an `index.tsx` that exports components:

```tsx
// components/Landing/index.tsx
export { Hero } from './Hero';
export { Features } from './Features';
export { CTASection } from './CTASection';
```

---

## Styling with Chakra UI

### Use Design Tokens

Always use Chakra's design tokens, never hardcoded values:

```tsx
// ✅ Good
<Box bg="gray.100" color="brand.500" p={4} borderRadius="lg" />

// ❌ Bad
<Box bg="#F3F4F6" color="#2EB67D" p="16px" borderRadius="8px" />
```

### Responsive Values

Use object syntax for responsive values:

```tsx
// ✅ Good
<Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} />
<Box py={{ base: 16, md: 24 }} />

// ❌ Bad - array syntax (less readable)
<Heading fontSize={['2xl', '3xl', '4xl']} />
```

### Theme Colors

| Color | Usage |
|-------|-------|
| `brand.500` | Primary actions, CTAs, links |
| `brand.50` | Light backgrounds, hover states |
| `gray.900` | Primary text |
| `gray.500` | Secondary text |
| `gray.100` | Borders, dividers |
| `gray.50` | Section backgrounds |

### Component Styling Order

Order Chakra props consistently:

```tsx
<Box
  // 1. Layout
  display="flex"
  flexDir="column"
  alignItems="center"
  // 2. Spacing
  p={6}
  py={{ base: 16, md: 24 }}
  gap={4}
  // 3. Sizing
  w="full"
  maxW="container.xl"
  h="auto"
  // 4. Colors
  bg="white"
  color="gray.900"
  // 5. Borders
  border="1px"
  borderColor="gray.100"
  borderRadius="xl"
  // 6. Effects
  boxShadow="sm"
  transition="all 0.2s"
  // 7. Pseudo states
  _hover={{ bg: 'gray.50' }}
  _active={{ bg: 'gray.100' }}
/>
```

---

## Icons

### All Icons in One File

Icons live in `components/icons/index.tsx`. Never create inline SVGs in components.

```tsx
// ✅ Good - import from icons
import { CalendarIcon, ArrowRightIcon } from '../icons';

// ❌ Bad - inline SVG
const MyIcon = () => <svg>...</svg>;
```

### Icon Component Pattern

```tsx
export const CalendarIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* paths */}
  </svg>
);
```

### Adding New Icons

1. Add to `components/icons/index.tsx`
2. Use `size` prop with default value
3. Use `currentColor` for stroke/fill (inherits from parent)

---

## Reusable UI Components

### Available Components

| Component | Location | Props |
|-----------|----------|-------|
| `Logo` | `ui/Logo.tsx` | `size`, `colorScheme`, `showTagline`, `onClick` |
| `PrimaryButton` | `ui/PrimaryButton.tsx` | `variant`, `showArrow`, + all Button props |

### Logo Usage

```tsx
// Header (light background)
<Logo size="md" onClick={() => navigate('/')} />

// Footer (dark background)
<Logo size="sm" colorScheme="dark" />

// Mobile drawer with tagline
<Logo size="lg" showTagline />
```

### PrimaryButton Usage

```tsx
// Default (green with arrow)
<PrimaryButton onClick={handleClick}>Start now</PrimaryButton>

// Without arrow
<PrimaryButton showArrow={false}>Submit</PrimaryButton>

// Light variant (white background)
<PrimaryButton variant="light">Learn more</PrimaryButton>

// Large size
<PrimaryButton size="lg" px={8}>Get Started</PrimaryButton>
```

---

## Chat Components

Reusable chat components for conversational interfaces. Used in onboarding and AI chat.

### Available Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ChatMessage` | `chat/ChatMessage.tsx` | Message bubble with typing animation |
| `ChatInput` | `chat/ChatInput.tsx` | Text input with submit button |
| `Suggestions` | `chat/Suggestions.tsx` | Clickable option buttons |
| `AllMessages` | `chat/AllMessages.tsx` | Container for message list |

### Message Types

```tsx
// types/chat.types.ts
interface Message {
  role: 'bot' | 'user';
  content: string;
  suggestions?: Suggestion[];
}

interface Suggestion {
  label: string;
  value: string;
  icon?: string;
  variant?: 'default' | 'skip';
}
```

### ChatMessage Usage

```tsx
import { ChatMessage } from '../chat';

// Bot message (left-aligned, gray background, typing animation)
<ChatMessage message={{ role: 'bot', content: 'Hello!' }} />

// User message (right-aligned, brand color)
<ChatMessage message={{ role: 'user', content: 'Hi there' }} />

// With suggestions
<ChatMessage
  message={{
    role: 'bot',
    content: 'Choose a category:',
    suggestions: [
      { label: 'Beauty', value: 'Beauty', icon: '💇' },
      { label: 'Skip', value: '', variant: 'skip' },
    ],
  }}
  onSuggestionSelect={(value) => console.log(value)}
/>
```

### ChatInput Usage

```tsx
import { ChatInput } from '../chat';

<ChatInput
  placeholder="Type your message..."
  onSubmit={(value) => handleSubmit(value)}
  disabled={isLoading}
/>
```

### Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `SplitLayout` | `Layout/SplitLayout.tsx` | 45%/55% split (left hidden on mobile) |
| `PublicLayout` | `Layout/PublicLayout.tsx` | Header wrapper for public routes |

```tsx
// SplitLayout - for onboarding/chat with side panel
<SplitLayout leftPanel={<StepIndicator />}>
  <ChatArea />
</SplitLayout>
```

---

## Constants

### Layout Constants

Use constants from `constants/layout.ts` for consistent spacing:

```tsx
import { SECTION_PADDING, CONTENT_MAX_WIDTH, SPACING } from '../../constants';

// Section padding
<Box py={{ base: SECTION_PADDING.base, md: SECTION_PADDING.md }} />

// Content width
<VStack maxW={CONTENT_MAX_WIDTH.hero} />

// Spacing
<SimpleGrid spacing={{ base: SPACING.card.base, md: SPACING.card.md }} />
```

### Adding New Constants

Add to appropriate file in `constants/`:

```tsx
// constants/layout.ts
export const SECTION_PADDING = { base: 16, md: 24 } as const;
export const CONTENT_MAX_WIDTH = {
  hero: '720px',
  section: '600px',
} as const;
```

---

## State Management

### RTK Query for API Calls

```tsx
// ✅ Good - use RTK Query hooks
const { data, isLoading, error } = useGetBusinessCategoriesQuery();

// ❌ Bad - manual fetch in useEffect
useEffect(() => {
  fetch('/api/categories').then(...);
}, []);
```

### API Slice Pattern

```tsx
// store/api/businessApi.ts
import { baseApi } from './baseApi';
import type { Business } from '../../types';

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyBusiness: builder.query<Business, void>({
      query: () => '/business/me',
      providesTags: ['Business'],
    }),
    createBusiness: builder.mutation<Business, CreateBusinessRequest>({
      query: (data) => ({
        url: '/business',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Business'],
    }),
  }),
});

export const { useGetMyBusinessQuery, useCreateBusinessMutation } = businessApi;
```

### Redux Slices

Use for UI state only (auth, onboarding wizard):

```tsx
// store/slices/authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});
```

---

## TypeScript Guidelines

### Interface Naming

```tsx
// Component props: {ComponentName}Props
interface CategoryCardProps { ... }

// API requests: {Action}{Entity}Request
interface CreateBookingRequest { ... }

// API responses: use the entity name
interface Booking { ... }
```

### Export Types

```tsx
// types/business.types.ts
export interface Business {
  id: number;
  name: string;
  // ...
}

// types/index.ts - re-export all
export type { Business, Service } from './business.types';
```

### Prop Typing

```tsx
// ✅ Good - explicit interface
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

// ✅ Good - extending existing types
interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'default' | 'light';
}
```

---

## Naming Conventions

### Files and Folders

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CategoryCard.tsx` |
| Folders | PascalCase for components | `BusinessCategories/` |
| Pages | kebab-case folders | `pages/landing/` |
| Utilities | camelCase | `formatDate.ts` |
| Constants | camelCase file, UPPER_CASE exports | `layout.ts` → `SECTION_PADDING` |
| Types | kebab-case with `.types.ts` | `business.types.ts` |

### Component Names

```tsx
// File: CategoryCard.tsx
export function CategoryCard() { ... }  // Same as filename

// File: index.tsx (in folder)
export function BusinessCategories() { ... }  // Folder name
```

---

## DRY Principles

### Before Creating New Code

1. **Check for existing components** in `ui/`, `Layout/`, `icons/`
2. **Check for existing constants** in `constants/`
3. **Check for existing API hooks** in `store/api/`

### Code Reuse Checklist

| Pattern | Where to find |
|---------|---------------|
| Logo | `components/ui/Logo.tsx` |
| CTA Buttons | `components/ui/PrimaryButton.tsx` |
| Icons | `components/icons/index.tsx` |
| Chat Messages | `components/chat/ChatMessage.tsx` |
| Chat Input | `components/chat/ChatInput.tsx` |
| Chat Suggestions | `components/chat/Suggestions.tsx` |
| Split Layout | `components/Layout/SplitLayout.tsx` |
| Section padding | `constants/layout.ts` |
| Container widths | `constants/layout.ts` |
| API calls | `store/api/*.ts` |

### Creating Reusable Components

If you use the same pattern 2+ times, extract it:

```tsx
// ❌ Bad - repeated styling
<Button bg="brand.500" _hover={{ bg: 'brand.600' }} rightIcon={<Arrow />}>
  Start now
</Button>
// ... same button elsewhere ...

// ✅ Good - extract to PrimaryButton
<PrimaryButton>Start now</PrimaryButton>
```

---

## Accessibility

### Interactive Elements

```tsx
// ✅ Good - keyboard accessible
<Text
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  }}
>
  Click me
</Text>

// ✅ Better - use actual button
<Box as="button" onClick={handleClick}>Click me</Box>
```

### ARIA Labels

```tsx
<IconButton aria-label="Open menu" icon={<MenuIcon />} />
<IconButton aria-label="Close menu" icon={<CloseIcon />} />
```

### Focus Management

```tsx
// Drawer should trap focus
<Drawer isOpen={isOpen} onClose={onClose}>
  {/* Focus is automatically managed by Chakra */}
</Drawer>
```

---

## Quick Reference

### Import Order

1. React/external libraries
2. Chakra UI
3. Third-party (framer-motion, react-router)
4. Internal components (`../ui/`, `../icons/`)
5. Store/hooks
6. Config/constants
7. Types

### Component Checklist

- [ ] Uses function component syntax
- [ ] Props interface defined
- [ ] Uses Chakra design tokens
- [ ] Uses constants for repeated values
- [ ] Uses existing icons from `icons/`
- [ ] Uses existing UI components (`Logo`, `PrimaryButton`)
- [ ] Responsive with `{{ base, md, lg }}` syntax
- [ ] Accessible (aria-labels, keyboard support)
- [ ] Exported from folder's `index.tsx`

