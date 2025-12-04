// Layout Constants - Single source of truth for spacing and sizing

// Section padding (vertical)
export const SECTION_PADDING = {
  base: 16,
  md: 24,
} as const;

// Container max widths
export const CONTAINER_MAX_WIDTH = {
  sm: 'container.sm',
  md: 'container.md',
  lg: 'container.lg',
  xl: 'container.xl',
} as const;

// Content max widths (for text blocks)
export const CONTENT_MAX_WIDTH = {
  hero: '720px',
  heroText: '560px',
  section: '600px',
  drawer: '300px',
} as const;

// Card sizes
export const CARD_WIDTH = {
  category: {
    base: '280px',
    md: '320px',
  },
} as const;

// Common spacing values
export const SPACING = {
  section: { base: 12, md: 16 },
  card: { base: 6, md: 8 },
} as const;

