import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Props = { active?: boolean; children: ReactNode };

export function PersonaChip({ active, children }: Props) {
  return (
    <Box
      px={5}
      py={2}
      borderRadius="full"
      fontSize="sm"
      fontWeight="medium"
      borderWidth="1px"
      bg={active ? 'text.heading' : 'surface.card'}
      color={active ? 'surface.card' : 'text.primary'}
      borderColor={active ? 'text.heading' : 'border.subtle'}
    >
      {children}
    </Box>
  );
}
