import { theme } from '@chakra-ui/react';

type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Get Chakra breakpoint value in pixels
 * Converts em values to px (assuming 16px base font size)
 */
export function getBreakpointPx(breakpoint: BreakpointKey): number {
  const value = theme.breakpoints[breakpoint]; // e.g., "48em"
  return parseFloat(value) * 16;
}

/**
 * Chakra breakpoint values in pixels for reference:
 * - sm: 480px
 * - md: 768px
 * - lg: 992px
 * - xl: 1280px
 * - 2xl: 1536px
 */
export const BREAKPOINTS = {
  sm: getBreakpointPx('sm'),
  md: getBreakpointPx('md'),
  lg: getBreakpointPx('lg'),
  xl: getBreakpointPx('xl'),
  '2xl': getBreakpointPx('2xl'),
} as const;

