import { useLayoutEffect } from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';
import { softFromHex } from './softFromHex';

interface BrandProviderProps extends BoxProps {
  brandColor?: string | null;
}

export function BrandProvider({ brandColor, children, ...rest }: BrandProviderProps) {
  const accent = brandColor || '#2EB67D';
  const soft = softFromHex(accent);

  // Mirror the brand vars onto :root so portalled content (Modal, Drawer, Popover)
  // inherits them too. Restore previous values on unmount.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = {
      accent: root.style.getPropertyValue('--brand-accent'),
      soft: root.style.getPropertyValue('--brand-accent-soft'),
      on: root.style.getPropertyValue('--brand-on-accent'),
    };
    root.style.setProperty('--brand-accent', accent);
    root.style.setProperty('--brand-accent-soft', soft);
    root.style.setProperty('--brand-on-accent', '#ffffff');
    return () => {
      root.style.setProperty('--brand-accent', prev.accent);
      root.style.setProperty('--brand-accent-soft', prev.soft);
      root.style.setProperty('--brand-on-accent', prev.on);
    };
  }, [accent, soft]);

  return (
    <Box
      sx={{
        '--brand-accent': accent,
        '--brand-accent-soft': soft,
        '--brand-on-accent': '#ffffff',
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
