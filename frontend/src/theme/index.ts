import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
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

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: 'lg',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          _disabled: {
            bg: 'brand.500',
          },
        },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
        },
      },
      ghost: {
        color: 'gray.600',
        _hover: {
          bg: 'gray.100',
        },
      },
    },
    defaultProps: {
      variant: 'solid',
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderRadius: 'lg',
          borderColor: 'gray.300',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'sm',
        border: '1px solid',
        borderColor: 'gray.200',
      },
    },
  },
};

const styles = {
  global: {
    'html, body': {
      bg: 'gray.50',
      color: 'gray.800',
      // Hide scrollbar but keep scroll functionality
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // IE and Edge
      '&::-webkit-scrollbar': {
        display: 'none', // Chrome, Safari, Opera
      },
    },
  },
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
});

