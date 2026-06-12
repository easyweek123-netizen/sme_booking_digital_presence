import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Variant = 'page' | 'alt';

type Props = {
  variant?: Variant;
  id?: string;
  backdrop?: ReactNode;
  children: ReactNode;
};

const BG: Record<Variant, string> = {
  page: 'surface.page',
  alt:  'surface.alt',
};

export function SectionShell({ variant = 'page', id, backdrop, children }: Props) {
  return (
    <Box
      as="section"
      id={id}
      bg={BG[variant]}
      py={{ base: 8, md: 16 }}
      px={{ base: 8, md: 8 }}
      position="relative"
      overflow="hidden"
    >
      {backdrop && (
        <Box position="absolute" inset={0} pointerEvents="none" zIndex={0}>
          {backdrop}
        </Box>
      )}
      <Box maxW="1100px" mx="auto" w="full" position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
}
