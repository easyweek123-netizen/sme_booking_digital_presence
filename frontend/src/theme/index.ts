// import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// const config: ThemeConfig = {
//   initialColorMode: 'light',
//   useSystemColorMode: false,
// };

// const colors = {
//   // Alert red — for notification badges (proposals, pending actions)
//   // rose-600 tone: noticeable but not harsh
//   alert: {
//     50: '#FFF1F2',
//     100: '#FFE4E6',
//     200: '#FECDD3',
//     300: '#FDA4AF',
//     400: '#FB7185',
//     500: '#E11D48',
//     600: '#BE123C',
//     700: '#9F1239',
//     800: '#881337',
//     900: '#4C0519',
//   },
//   brand: {
//     50: '#E6F7F0',
//     100: '#C0EAD8',
//     200: '#96DCBE',
//     300: '#6CCEA4',
//     400: '#4DC391',
//     500: '#2EB67D', // Primary green (eco/fresh)
//     600: '#26A06E',
//     700: '#1D885D',
//     800: '#15704D',
//     900: '#0D583D',
//   },
//   // Modern Slate palette (Tailwind standard - used by Linear, Vercel, Stripe)
//   gray: {
//     50: '#F5F7F9',   // Light cool neutral
//     100: '#F1F5F9',  // Subtle blue undertone
//     200: '#E2E8F0',
//     300: '#CBD5E1',
//     400: '#94A3B8',
//     500: '#64748B',
//     600: '#475569',
//     700: '#334155',
//     800: '#1E293B',  // Rich dark
//     900: '#0F172A',  // Near black with depth
//   },
// };

// const fonts = {
//   heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
//   body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
// };

// const fontSizes = {
//   xs: '0.75rem',    // 12px
//   sm: '0.875rem',   // 14px
//   md: '1rem',       // 16px
//   lg: '1.125rem',   // 18px
//   xl: '1.25rem',    // 20px
//   '2xl': '1.5rem',  // 24px
//   '3xl': '1.875rem',// 30px
//   '4xl': '2.25rem', // 36px
//   '5xl': '3rem',    // 48px
//   '6xl': '3.75rem', // 60px
// };

// const lineHeights = {
//   none: '1',
//   tight: '1.15',
//   snug: '1.25',
//   normal: '1.5',
//   relaxed: '1.65',
//   loose: '1.8',
// };

// const letterSpacings = {
//   tighter: '-0.04em',
//   tight: '-0.02em',
//   normal: '0',
//   wide: '0.02em',
//   wider: '0.04em',
// };

// const radii = {
//   none: '0',
//   sm: '0.375rem', // 6px
//   md: '0.5rem',   // 8px
//   lg: '0.75rem',  // 12px
//   xl: '1rem',     // 16px
//   '2xl': '1.5rem',// 24px
//   full: '9999px',
// };

// const shadows = {
//   xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
//   sm: '0 1px 2px rgba(15, 23, 42, 0.05), 0 1px 1px rgba(15, 23, 42, 0.04)',
//   card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
//   cardHover: '0 8px 24px rgba(15, 23, 42, 0.08)',
//   input: '0 1px 2px rgba(15, 23, 42, 0.05)',
//   inputFocus: '0 0 0 3px rgba(46, 182, 125, 0.2)',
//   modal: '0 20px 50px rgba(15, 23, 42, 0.12)',
//   popover: '0 8px 20px rgba(15, 23, 42, 0.1)',
//   outline: '0 0 0 3px rgba(46, 182, 125, 0.3)', // override Chakra's blue outline
// };

// const semanticTokens = {
//   colors: {
//     'surface.page':     { default: 'gray.50',  _dark: 'gray.900' },
//     'surface.card':     { default: 'white',    _dark: 'gray.800' },
//     'surface.muted':    { default: 'gray.50',  _dark: 'gray.800' },
//     'surface.inverted': { default: 'gray.900', _dark: 'white' },
//     'border.subtle':    { default: 'gray.200', _dark: 'gray.700' },
//     'border.strong':    { default: 'gray.300', _dark: 'gray.600' },
//     'text.primary':     { default: 'gray.900', _dark: 'gray.50' },
//     'text.secondary':   { default: 'gray.600', _dark: 'gray.300' },
//     'text.muted':       { default: 'gray.500', _dark: 'gray.400' },
//     'text.inverted':    { default: 'white',    _dark: 'gray.900' },
//     'accent.primary':   { default: 'brand.500', _dark: 'brand.400' },
//     'accent.hover':     { default: 'brand.600', _dark: 'brand.300' },
//     'danger.primary':   { default: 'alert.500', _dark: 'alert.400' },
//   },
// };

// const components = {
//   Button: {
//     baseStyle: {
//       paddingX: 0.5,
//       paddingY: 1,
//       fontWeight: '600',
//       borderRadius: 'md',
//       _focusVisible: { boxShadow: 'outline' },
//     },
//     variants: {
//       solid: {
//         bg: 'brand.500',
//         color: 'white',
//         _hover: { bg: 'brand.600', _disabled: { bg: 'brand.500' } },
//         _active: { bg: 'brand.700' },
//       },
//       outline: {
//         borderColor: 'brand.500',
//         color: 'brand.500',
//         _hover: { bg: 'brand.50' },
//       },
//       ghost: {
//         color: 'text.secondary',
//         _hover: { bg: 'gray.100', color: 'text.primary' },
//       },
//     },
//     defaultProps: { variant: 'solid' },
//   },
//   Heading: {
//     baseStyle: {
//       color: 'text.primary',
//       fontWeight: '700',
//       letterSpacing: 'tight',
//       lineHeight: 'tight',
//     },
//     sizes: {
//       '2xl': { fontSize: { base: '4xl', md: '5xl' }, lineHeight: 'tight' },
//       xl:    { fontSize: { base: '3xl', md: '4xl' }, lineHeight: 'tight' },
//       lg:    { fontSize: { base: '2xl', md: '3xl' }, lineHeight: 'snug' },
//       md:    { fontSize: 'xl',                       lineHeight: 'snug' },
//       sm:    { fontSize: 'lg',                       lineHeight: 'snug' },
//     },
//   },
//   Text: {
//     baseStyle: {
//       color: 'text.secondary',
//       lineHeight: 'normal',
//     },
//   },
//   Input: {
//     variants: {
//       outline: {
//         field: {
//           borderRadius: 'md',
//           borderColor: 'border.strong',
//           bg: 'surface.card',
//           _hover: { borderColor: 'gray.400' },
//           _focus: {
//             borderColor: 'brand.500',
//             boxShadow: 'inputFocus',
//           },
//           _invalid: {
//             borderColor: 'alert.500',
//             boxShadow: '0 0 0 3px rgba(225, 29, 72, 0.15)',
//           },
//         },
//       },
//     },
//     defaultProps: { variant: 'outline' },
//   },
//   Textarea: {
//     variants: {
//       outline: {
//         borderRadius: 'md',
//         borderColor: 'border.strong',
//         bg: 'surface.card',
//         _hover: { borderColor: 'gray.400' },
//         _focus: { borderColor: 'brand.500', boxShadow: 'inputFocus' },
//         _invalid: { borderColor: 'alert.500', boxShadow: '0 0 0 3px rgba(225, 29, 72, 0.15)' },
//       },
//     },
//     defaultProps: { variant: 'outline' },
//   },
//   Select: {
//     variants: {
//       outline: {
//         field: {
//           borderRadius: 'md',
//           borderColor: 'border.strong',
//           bg: 'surface.card',
//           _focus: { borderColor: 'brand.500', boxShadow: 'inputFocus' },
//         },
//       },
//     },
//     defaultProps: { variant: 'outline' },
//   },
//   Card: {
//     baseStyle: {
//       container: {
//         borderRadius: 'sm',
//         boxShadow: 'card',
//         border: '1px solid',
//         borderColor: 'border.subtle',
//         bg: 'surface.card',
//       },
//     },
//   },
//   Modal: {
//     baseStyle: {
//       dialog: {
//         borderRadius: 'md',
//         boxShadow: 'modal',
//         bg: 'surface.card',
//       },
//     },
//   },
//   FormLabel: {
//     baseStyle: {
//       fontSize: 'sm',
//       fontWeight: '500',
//       color: 'text.secondary',
//       mb: 1.5,
//     },
//   },
// };

// const styles = {
//   global: {
//     'html, body': {
//       bg: 'surface.page',
//       color: 'text.primary',
//       fontFeatureSettings: '"cv11", "ss01"', // Inter: more legible digits + disambiguated letters
//     },
//     '*:focus': { outline: 'none' },
//     '*:focus-visible': { outline: 'none', boxShadow: 'outline' },
//   },
// };

// export const theme = extendTheme({
//   config,
//   colors,
//   fonts,
//   fontSizes,
//   lineHeights,
//   letterSpacings,
//   radii,
//   shadows,
//   semanticTokens,
//   components,
//   styles,
// });


// ============================================================
// Book Easy — Limepay theme
// Drop into frontend/src/theme/index.ts
// ============================================================
//
// Design system: cream surfaces + navy ink text + purple brand + coral warm.
// Everything maps through semantic tokens so you can swap palettes later
// without touching component code.

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// ------------------------------------------------------------
// Colors
// ------------------------------------------------------------
const colors = {
  // Brand — purple (the Limepay accent)
  brand: {
    50:  '#F3EEFC',
    100: '#E7DDF8',
    200: '#D8CCF0',
    300: '#B49AE2',
    400: '#9575CD',
    500: '#6B46C1', // primary accent ★
    600: '#553C9A', // hover
    700: '#3D2E6E',
    800: '#2D2254',
    900: '#1E1739',
  },

  // Gray scale — deliberately warm in the light end (cream), cool in the
  // dark end (navy ink). This IS the whole trick: backgrounds are
  // parchment, text is navy. Never map gray.* to neutral grey.
  gray: {
    50:  '#FBF9F5', // cream.50  — barely-tinted white
    100: '#F7F3EE', // cream.100 — page background ★
    200: '#EFE9E1', // cream.200 — muted surfaces
    300: '#E6DED2', // cream.300 — default borders
    400: '#D9CFBF', // cream.400 — strong borders
    500: '#A9A2C0', // ink.200   — muted text
    600: '#524680', // ink.400   — secondary text
    700: '#2A2250', // ink.500   — subheads
    800: '#1F1A43', // ink.600   — primary text / primary button ★ (NAVY, not black)
    900: '#15113A', // ink.700   — deepest ink
  },

  // Alert — rust (muted, doesn't scream on warm backgrounds)
  alert: {
    50:  '#FDF4F0',
    100: '#F9E3DB',
    200: '#F3C7B8',
    300: '#E59F85',
    400: '#D17858',
    500: '#B85A40', // rust ★
    600: '#9C4A34',
    700: '#7E3B29',
    800: '#5F2C1F',
    900: '#3F1D15',
  },

  // Coral — warm secondary accent. Use sparingly: featured badges,
  // promos, celebrations. Never as a button unless it IS the promo.
  coral: {
    50:  '#FDF2EE',
    100: '#FBE4DA',
    200: '#F7CBB8',
    300: '#F1A88C',
    400: '#E8856B', // coral ★
    500: '#D76A4E',
    600: '#B8553E',
    700: '#8F4230',
    800: '#672F22',
    900: '#401D15',
  },

  // Sage — success (olive-green, not emerald; sits well on cream)
  sage: {
    50:  '#F2F7F0',
    100: '#E7F0E3',
    200: '#CCE0C4',
    300: '#A8CA9D',
    400: '#87B57B',
    500: '#6B9E5F', // sage ★
    600: '#55824B',
    700: '#40663A',
    800: '#2C4A28',
    900: '#1B2F18',
  },

  // Amber — warning (muted gold, not yellow)
  amber: {
    50:  '#FDF6E9',
    100: '#FBEEDD',
    200: '#F5DAB0',
    300: '#EBC079',
    400: '#DFAA58',
    500: '#D49942', // amber ★
    600: '#B37E32',
    700: '#8A6126',
    800: '#61441B',
    900: '#3B2910',
  },
};

// ------------------------------------------------------------
// Typography
// ------------------------------------------------------------
const fonts = {
  heading: `'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  body:    `'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  mono:    `'JetBrains Mono', 'SF Mono', Menlo, monospace`,
};

const fontSizes = {
  xs:  '0.75rem',    // 12
  sm:  '0.875rem',   // 14
  md:  '1rem',       // 16
  lg:  '1.125rem',   // 18
  xl:  '1.25rem',    // 20
  '2xl': '1.5rem',   // 24
  '3xl': '1.875rem', // 30
  '4xl': '2.25rem',  // 36
  '5xl': '3rem',     // 48
  '6xl': '3.75rem',  // 60
};

const lineHeights = {
  none: '1', tight: '1.15', snug: '1.25',
  normal: '1.5', relaxed: '1.65', loose: '1.8',
};

const letterSpacings = {
  tighter: '-0.04em', tight: '-0.02em',
  normal: '0', wide: '0.02em', wider: '0.04em',
};

// ------------------------------------------------------------
// Spacing — 4pt grid (Chakra numeric scale + named semantic aliases)
// ------------------------------------------------------------
const space = {
  px: '1px',
  0.5: '0.125rem', //  2px
  1: '0.25rem', //  4px — hairline gaps
  1.5: '0.375rem', //  6px
  2: '0.5rem', //  8px — tight stacks, icon gaps
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px — compact padding
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px — default component padding ★
  5: '1.25rem', // 20px — card padding
  6: '1.5rem', // 24px — section inner spacing ★
  7: '1.75rem', // 28px
  8: '2rem', // 32px — between cards
  10: '2.5rem', // 40px
  12: '3rem', // 48px — section vertical rhythm ★
  14: '3.5rem', // 56px
  16: '4rem', // 64px — between major sections
  20: '5rem', // 80px — hero padding
  24: '6rem', // 96px
  32: '8rem', // 128px — page-level separations

  // Semantic aliases — use in components when intent matters (same rem as numeric keys above)
  'space.inline.xs': '0.25rem', //  4 — icon → label
  'space.inline.sm': '0.5rem', //  8 — inline row elements
  'space.inline.md': '0.75rem', // 12
  'space.inline.lg': '1rem', // 16

  'space.stack.xs': '0.5rem', //  8 — tight label + input
  'space.stack.sm': '0.75rem', // 12 — form fields
  'space.stack.md': '1rem', // 16 — card content blocks
  'space.stack.lg': '1.5rem', // 24 — between sections in a card
  'space.stack.xl': '2.5rem', // 40

  'space.card.padding': '1.25rem', // 20 — default card padding
  'space.card.paddingLg': '1.5rem', // 24 — hero card padding
  'space.section.y': '3rem', // 48 — vertical rhythm between sections
  'space.section.yLg': '4rem', // 64
  'space.page.x': '1.5rem', // 24 — horizontal page gutters (mobile)
  'space.page.xLg': '2.5rem', // 40 — horizontal page gutters (desktop)
};

const sizes = {
  ...space
};

// ------------------------------------------------------------
// Shape
// ------------------------------------------------------------
const radii = {
  none: '0',
  xs:   '0.25rem',  // 4px  — chips, tiny badges
  sm:   '0.375rem', // 6px  — buttons, inputs, inner cards
  md:   '0.5rem',   // 8px  — default cards ★
  lg:   '0.75rem',  // 12px — hero cards, modals
  xl:   '1rem',     // 16px — feature cards
  '2xl':'1.5rem',
  full: '9999px',
};

// Ink-tinted shadows — ALL shadows use rgba(31, 26, 67, …) which is
// ink.600 with alpha. This keeps shadows warm and part of the system.
const shadows = {
  xs:         '0 1px 2px rgba(31, 26, 67, 0.04)',
  sm:         '0 1px 3px rgba(31, 26, 67, 0.06), 0 1px 2px rgba(31, 26, 67, 0.04)',
  card:       '0 4px 12px rgba(31, 26, 67, 0.06), 0 2px 4px rgba(31, 26, 67, 0.04)',
  cardHover:  '0 12px 32px rgba(31, 26, 67, 0.08)',
  input:      '0 1px 2px rgba(31, 26, 67, 0.05)',
  inputFocus: '0 0 0 3px rgba(107, 70, 193, 0.22)', // purple ring
  modal:      '0 24px 48px rgba(31, 26, 67, 0.12)',
  popover:    '0 12px 32px rgba(31, 26, 67, 0.08)',
  outline:    '0 0 0 3px rgba(107, 70, 193, 0.22)', // focus ring
};

// ------------------------------------------------------------
// Semantic tokens
// ------------------------------------------------------------
// Use THESE in components, not raw colors. If we ever rebrand,
// only this block has to change.
const semanticTokens = {
  colors: {
    // Surfaces
    'surface.page':     { default: 'gray.100', _dark: 'gray.900' },
    'surface.alt':      { default: 'gray.50',  _dark: 'gray.800' },
    'surface.card':     { default: 'white',    _dark: 'gray.800' },
    'surface.muted':    { default: 'gray.200', _dark: 'gray.800' },
    'surface.inverted': { default: 'gray.800', _dark: 'white'    },

    // Borders
    'border.subtle':    { default: 'gray.300', _dark: 'gray.700' },
    'border.strong':    { default: 'gray.400', _dark: 'gray.600' },
    'border.accent':    { default: 'brand.200', _dark: 'brand.700' },

    // Text
    'text.primary':     { default: 'gray.800', _dark: 'gray.50'  },
    'text.secondary':   { default: 'gray.600', _dark: 'gray.300' },
    'text.muted':       { default: 'gray.500', _dark: 'gray.400' },
    'text.inverted':    { default: 'gray.100', _dark: 'gray.800' },
    'text.heading':     { default: 'gray.900', _dark: 'white'     },
    'text.strong':      { default: 'gray.700', _dark: 'gray.200' },
    'text.faint':       { default: 'gray.400', _dark: 'gray.500' },

    // Brand
    'accent.primary':   { default: 'brand.500', _dark: 'brand.400' },
    'accent.hover':     { default: 'brand.600', _dark: 'brand.300' },
    'accent.soft':      { default: 'brand.50',  _dark: 'brand.900' },

    // Semantic
    'danger.primary':   { default: 'alert.500', _dark: 'alert.400' },
    'danger.soft':      { default: 'alert.100', _dark: 'alert.800' },
    'success.primary':  { default: 'sage.500',  _dark: 'sage.400'  },
    'success.soft':     { default: 'sage.100',  _dark: 'sage.800'  },
    'warning.primary':  { default: 'amber.500', _dark: 'amber.400' },
    'warning.soft':     { default: 'amber.100', _dark: 'amber.800' },
  },
};

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------
const components = {
  Button: {
    baseStyle: {
      fontWeight: '500',
      borderRadius: 'sm',
      letterSpacing: '-0.005em',
      _focusVisible: { boxShadow: 'outline' },
    },
    sizes: {
      sm: { h: 8,  px: 3,   fontSize: 'sm' },
      md: { h: 10, px: 3.5, fontSize: 'sm' },
      lg: { h: 12, px: 5,   fontSize: 'md' },
    },
    variants: {
      // Default — navy primary (the workhorse)
      solid: {
        bg: 'gray.800', color: 'gray.100',
        _hover:  { bg: 'gray.900', _disabled: { bg: 'gray.800' } },
        _active: { bg: 'gray.900' },
      },
      // Accent purple — use for the ONE call-to-action on a page
      accent: {
        bg: 'brand.500', color: 'white',
        _hover:  { bg: 'brand.600' },
        _active: { bg: 'brand.700' },
      },
      outline: {
        borderColor: 'border.strong', color: 'text.primary', bg: 'transparent',
        _hover: { bg: 'gray.100', borderColor: 'gray.500' },
      },
      ghost: {
        color: 'text.secondary',
        _hover: { bg: 'gray.100', color: 'text.primary' },
      },
      // Rare — promos, celebrations only
      warm: {
        bg: 'coral.400', color: 'white',
        _hover:  { bg: 'coral.500' },
        _active: { bg: 'coral.600' },
      },
    },
    defaultProps: { variant: 'solid', size: 'md' },
  },

  Heading: {
    baseStyle: {
      color: 'text.heading',
      fontWeight: '600',         // Geist semibold — not bold
      letterSpacing: 'tight',
      lineHeight: 'tight',
    },
    sizes: {
      '2xl': { fontSize: { base: '4xl', md: '5xl' }, lineHeight: 'tight'   },
      xl:    { fontSize: { base: '3xl', md: '4xl' }, lineHeight: 'tight'   },
      lg:    { fontSize: { base: '2xl', md: '3xl' }, lineHeight: 'snug'    },
      md:    { fontSize: 'xl',                       lineHeight: 'snug'    },
      sm:    { fontSize: 'lg',                       lineHeight: 'snug'    },
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
          borderRadius: 'sm',
          borderColor: 'border.strong',
          bg: 'surface.card',
          _hover: { borderColor: 'gray.500' },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: 'inputFocus',
          },
          _invalid: {
            borderColor: 'alert.500',
            boxShadow: '0 0 0 3px rgba(184, 90, 64, 0.2)',
          },
        },
      },
    },
    defaultProps: { variant: 'outline' },
  },

  Textarea: {
    variants: {
      outline: {
        borderRadius: 'sm',
        borderColor: 'border.strong',
        bg: 'surface.card',
        _hover: { borderColor: 'gray.500' },
        _focus: { borderColor: 'brand.500', boxShadow: 'inputFocus' },
        _invalid: { borderColor: 'alert.500', boxShadow: '0 0 0 3px rgba(184, 90, 64, 0.2)' },
      },
    },
    defaultProps: { variant: 'outline' },
  },

  Select: {
    variants: {
      outline: {
        field: {
          borderRadius: 'sm',
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
        borderRadius: 'md',
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
        borderRadius: 'lg',
        boxShadow: 'modal',
        bg: 'surface.card',
      },
    },
  },

  Badge: {
    baseStyle: {
      textTransform: 'none',
      fontWeight: '500',
      borderRadius: 'xs',
      px: 2, py: 0.5,
    },
    variants: {
      subtle: { bg: 'gray.200', color: 'text.secondary' },
      accent: { bg: 'accent.soft', color: 'brand.700' },
      success:{ bg: 'success.soft', color: 'sage.700' },
      warm:   { bg: 'coral.100', color: 'coral.700' },
    },
    defaultProps: { variant: 'subtle' },
  },

  FormLabel: {
    baseStyle: {
      fontSize: 'sm',
      fontWeight: '500',
      color: 'text.secondary',
      mb: 1.5,
    },
  },

  Divider: {
    baseStyle: { borderColor: 'border.subtle' },
  },
};

// ------------------------------------------------------------
// Global styles
// ------------------------------------------------------------
const styles = {
  global: {
    'html, body': {
      bg: 'surface.page',
      color: 'text.primary',
      fontFeatureSettings: '"cv11", "ss01"', // Geist stylistic sets
      fontSize: '16px',
    },
    '*:focus': { outline: 'none' },
    '*:focus-visible': { outline: 'none', boxShadow: 'outline' },
    // Selection — purple tint, readable
    '::selection': {
      bg: 'brand.200',
      color: 'text.heading',
    },
  },
};

// ------------------------------------------------------------
// Export
// ------------------------------------------------------------
export const theme = extendTheme({
  config,
  colors,
  fonts,
  fontSizes,
  lineHeights,
  letterSpacings,
  radii,
  shadows,
  space,
  // sizes,
  semanticTokens,
  components,
  styles,
});
