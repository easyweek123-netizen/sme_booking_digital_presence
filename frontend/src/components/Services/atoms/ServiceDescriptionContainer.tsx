import { Box, Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export function ServiceDescriptionContainer({ children }: { children: ReactNode }) {
  return (
    <Box
      bgGradient="linear(to-b, transparent 0%, blackAlpha.600 50%, blackAlpha.900 100%)"
      color="whiteAlpha.900"
      p={{ base: 4 }}
    >
      <Flex justify="space-between" align="flex-end" gap={3}>
        {children}
      </Flex>
    </Box>
  );
}
