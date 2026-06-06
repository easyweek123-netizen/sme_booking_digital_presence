import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Box mx="auto" w="320px" maxW="100%" borderRadius="32px" bg="gray.900" p="10px" boxShadow="xl">
      <Box position="relative" borderRadius="24px" bg="white" overflow="hidden" h="560px">
        {/* notch */}
        <Box position="absolute" top="6px" left="50%" transform="translateX(-50%)" w="80px" h="4px" borderRadius="full" bg="gray.700" zIndex={2} />
        <Box h="100%" overflowY="auto">{children}</Box>
      </Box>
    </Box>
  );
}
