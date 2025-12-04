import { Box, Container, HStack, Text } from '@chakra-ui/react';
import { Logo } from '../ui/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="gray.900"
      borderTop="1px"
      borderColor="gray.800"
      py={8}
    >
      <Container maxW="container.xl">
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Logo size="sm" colorScheme="dark" />
          <Text color="gray.500" fontSize="sm">
            © {currentYear} BookEasy. All rights reserved.
          </Text>
        </HStack>
      </Container>
    </Box>
  );
}
