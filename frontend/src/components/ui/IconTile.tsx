import { Box, type BoxProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface IconTileProps extends BoxProps {
  children: ReactNode;
  /** Visual variant: 'muted' is the default. 'brand' is used in section headers. */
  tone?: 'muted' | 'brand';
  /** Size token. 'sm' = 36px (LocationDropdown row), 'md' = 40px (section header). */
  size?: 'sm' | 'md';
}

const SIZE = { sm: 9, md: 10 } as const;

/**
 * Square rounded tile that holds a 16–20px icon. Replaces the three nearly
 * identical `Box w={9-10} h={9-10}` blocks scattered across the location
 * pickers.
 */
export function IconTile({ children, tone = 'muted', size = 'md', ...rest }: IconTileProps) {
  return (
    <Box
      w={SIZE[size]}
      h={SIZE[size]}
      borderRadius="md"
      bg={tone === 'brand' ? 'surface.card' : 'surface.muted'}
      color={tone === 'brand' ? 'brand.600' : 'text.muted'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      {...rest}
    >
      {children}
    </Box>
  );
}
