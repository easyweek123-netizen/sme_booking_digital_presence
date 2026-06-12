import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Props = { url?: string; children: ReactNode };

export function BrowserFrame({ url, children }: Props) {
  return (
    <Box
      bg="surface.card"
      borderRadius="xl"
      boxShadow="lg"
      borderWidth="1px"
      borderColor="border.subtle"
      overflow="hidden"
      w="full"
    >
      <Flex
        align="center"
        gap={3}
        px={4}
        py={3}
        borderBottomWidth="1px"
        borderColor="border.subtle"
        bg="surface.alt"
      >
        <HStack spacing={1.5}>
          <Box w={2.5} h={2.5} borderRadius="full" bg="border.strong" opacity={0.4} />
          <Box w={2.5} h={2.5} borderRadius="full" bg="border.strong" opacity={0.4} />
          <Box w={2.5} h={2.5} borderRadius="full" bg="border.strong" opacity={0.4} />
        </HStack>
        {url && (
          <Box
            flex={1}
            bg="surface.card"
            borderRadius="md"
            px={3}
            py={1}
            textAlign="center"
          >
            <Text fontSize="xs" color="text.muted">{url}</Text>
          </Box>
        )}
      </Flex>
      <Box>{children}</Box>
    </Box>
  );
}
