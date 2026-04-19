import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  // Alert red — for notification badges (proposals, pending actions)
  // rose-600 tone: noticeable but not harsh
  alert: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#E11D48',
    600: '#BE123C',
    700: '#9F1239',
    800: '#881337',
    900: '#4C0519',
  },
  brand: {
    50: '#E6F7F0',
    100: '#C0EAD8',
    200: '#96DCBE',
    300: '#6CCEA4',
    400: '#4DC391',
    500: '#2EB67D', // Primary green (eco/fresh)
    600: '#26A06E',
    700: '#1D885D',
    800: '#15704D',
    900: '#0D583D',
  },
  // Modern Slate palette (Tailwind standard - used by Linear, Vercel, Stripe)
  gray: {
    50: '#F5F7F9',   // Light cool neutral
    100: '#F1F5F9',  // Subtle blue undertone
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',  // Rich dark
    900: '#0F172A',  // Near black with depth
  },
};

const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
};

const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  md: '1rem',       // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
};

const lineHeights = {
  none: '1',
  tight: '1.15',
  snug: '1.25',
  normal: '1.5',
  relaxed: '1.65',
  loose: '1.8',
};

const letterSpacings = {
  tighter: '-0.04em',
  tight: '-0.02em',
  normal: '0',
  wide: '0.02em',
  wider: '0.04em',
};

const radii = {
  none: '0',
  sm: '0.375rem', // 6px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  '2xl': '1.5rem',// 24px
  full: '9999px',
};

const shadows = {
  xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
  sm: '0 1px 2px rgba(15, 23, 42, 0.05), 0 1px 1px rgba(15, 23, 42, 0.04)',
  card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
  cardHover: '0 8px 24px rgba(15, 23, 42, 0.08)',
  input: '0 1px 2px rgba(15, 23, 42, 0.05)',
  inputFocus: '0 0 0 3px rgba(46, 182, 125, 0.2)',
  modal: '0 20px 50px rgba(15, 23, 42, 0.12)',
  popover: '0 8px 20px rgba(15, 23, 42, 0.1)',
  outline: '0 0 0 3px rgba(46, 182, 125, 0.3)', // override Chakra's blue outline
};

const semanticTokens = {
  colors: {
    'surface.page':     { default: 'gray.50',  _dark: 'gray.900' },
    'surface.card':     { default: 'white',    _dark: 'gray.800' },
    'surface.muted':    { default: 'gray.50',  _dark: 'gray.800' },
    'surface.inverted': { default: 'gray.900', _dark: 'white' },
    'border.subtle':    { default: 'gray.200', _dark: 'gray.700' },
    'border.strong':    { default: 'gray.300', _dark: 'gray.600' },
    'text.primary':     { default: 'gray.900', _dark: 'gray.50' },
    'text.secondary':   { default: 'gray.600', _dark: 'gray.300' },
    'text.muted':       { default: 'gray.500', _dark: 'gray.400' },
    'text.inverted':    { default: 'white',    _dark: 'gray.900' },
    'accent.primary':   { default: 'brand.500', _dark: 'brand.400' },
    'accent.hover':     { default: 'brand.600', _dark: 'brand.300' },
    'danger.primary':   { default: 'alert.500', _dark: 'alert.400' },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: 'lg',
      _focusVisible: { boxShadow: 'outline' },
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: { bg: 'brand.600', _disabled: { bg: 'brand.500' } },
        _active: { bg: 'brand.700' },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: { bg: 'brand.50' },
      },
      ghost: {
        color: 'text.secondary',
        _hover: { bg: 'gray.100', color: 'text.primary' },
      },
    },
    defaultProps: { variant: 'solid' },
  },
  Heading: {
    baseStyle: {
      color: 'text.primary',
      fontWeight: '700',
      letterSpacing: 'tight',
      lineHeight: 'tight',
    },
    sizes: {
      '2xl': { fontSize: { base: '4xl', md: '5xl' }, lineHeight: 'tight' },
      xl:    { fontSize: { base: '3xl', md: '4xl' }, lineHeight: 'tight' },
      lg:    { fontSize: { base: '2xl', md: '3xl' }, lineHeight: 'snug' },
      md:    { fontSize: 'xl',                       lineHeight: 'snug' },
      sm:    { fontSize: 'lg',                       lineHeight: 'snug' },
    },
  },
  Text: {
    baseStyle: {
      color: 'text.secondary',
      lineHeight: 'normal',
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderRadius: 'lg',
          borderColor: 'border.strong',
          bg: 'surface.card',
          _hover: { borderColor: 'gray.400' },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: 'inputFocus',
          },
          _invalid: {
            borderColor: 'alert.500',
            boxShadow: '0 0 0 3px rgba(225, 29, 72, 0.15)',
          },
        },
      },
    },
    defaultProps: { variant: 'outline' },
  },
  Textarea: {
    variants: {
      outline: {
        borderRadius: 'lg',
        borderColor: 'border.strong',
        bg: 'surface.card',
        _hover: { borderColor: 'gray.400' },
        _focus: { borderColor: 'brand.500', boxShadow: 'inputFocus' },
        _invalid: { borderColor: 'alert.500', boxShadow: '0 0 0 3px rgba(225, 29, 72, 0.15)' },
      },
    },
    defaultProps: { variant: 'outline' },
  },
  Select: {
    variants: {
      outline: {
        field: {
          borderRadius: 'lg',
          borderColor: 'border.strong',
          bg: 'surface.card',
          _focus: { borderColor: 'brand.500', boxShadow: 'inputFocus' },
        },
      },
    },
    defaultProps: { variant: 'outline' },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'card',
        border: '1px solid',
        borderColor: 'border.subtle',
        bg: 'surface.card',
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        borderRadius: '2xl',
        boxShadow: 'modal',
        bg: 'surface.card',
      },
    },
  },
  FormLabel: {
    baseStyle: {
      fontSize: 'sm',
      fontWeight: '500',
      color: 'text.secondary',
      mb: 1.5,
    },
  },
};

const styles = {
  global: {
    'html, body': {
      bg: 'surface.page',
      color: 'text.primary',
      fontFeatureSettings: '"cv11", "ss01"', // Inter: more legible digits + disambiguated letters
    },
    '*:focus': { outline: 'none' },
    '*:focus-visible': { outline: 'none', boxShadow: 'outline' },
  },
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  fontSizes,
  lineHeights,
  letterSpacings,
  radii,
  shadows,
  semanticTokens,
  components,
  styles,
});
