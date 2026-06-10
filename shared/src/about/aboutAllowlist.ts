export const ABOUT_ALLOWED_TAGS = [
  'p', 'br',
  'h2', 'h3',
  'strong', 'em', 'u',
  'ul', 'ol', 'li',
  'blockquote',
  'figure', 'img', 'figcaption',
] as const;

export const ABOUT_ALLOWED_ATTRS: Record<string, readonly string[]> = {
  img: ['src', 'alt'],
};

