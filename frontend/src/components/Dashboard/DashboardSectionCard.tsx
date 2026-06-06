import { Box, type BoxProps } from '@chakra-ui/react';

/**
 * Standard white card chrome used by Dashboard forms.
 * Use it inside tab components; the orchestrator stays chrome-free.
 */
export function DashboardSectionCard({ children, ...rest }: BoxProps) {
  return (
    <Box
      bg="surface.card"
      borderRadius="xl"
      border="1px solid"
      borderColor="border.subtle"
      p={{ base: 4 }}
      {...rest}
    >
      {children}
    </Box>
  );
}
