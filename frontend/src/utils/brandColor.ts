/**
 * Brand color utilities for dynamic theming
 */

/**
 * Convert hex to RGB components
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Lighten or darken a color
 * @param hex - The hex color
 * @param percent - Positive to lighten, negative to darken (-100 to 100)
 */
function adjustColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const amount = Math.round(2.55 * percent);

  const newR = Math.max(0, Math.min(255, r + amount));
  const newG = Math.max(0, Math.min(255, g + amount));
  const newB = Math.max(0, Math.min(255, b + amount));

  return rgbToHex(newR, newG, newB);
}

/**
 * Generate color shades from a base color (50-900)
 */
export function generateColorShades(hex: string): Record<string, string> {
  return {
    '50': adjustColor(hex, 45),
    '100': adjustColor(hex, 35),
    '200': adjustColor(hex, 25),
    '300': adjustColor(hex, 15),
    '400': adjustColor(hex, 5),
    '500': hex,
    '600': adjustColor(hex, -10),
    '700': adjustColor(hex, -20),
    '800': adjustColor(hex, -30),
    '900': adjustColor(hex, -40),
  };
}

/**
 * Generate CSS variables for brand color override
 */
export function generateBrandColorCss(hex: string): Record<string, string> {
  const shades = generateColorShades(hex);
  const cssVars: Record<string, string> = {};

  Object.entries(shades).forEach(([shade, color]) => {
    cssVars[`--chakra-colors-brand-${shade}`] = color;
  });

  return cssVars;
}

/**
 * Default brand color (BookEasy green)
 */
export const DEFAULT_BRAND_COLOR = '#2EB67D';

/**
 * Validate hex color format
 */
export function isValidHexColor(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

