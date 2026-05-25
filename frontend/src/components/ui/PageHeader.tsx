import type { ReactNode } from 'react';
import { Box, Flex, VStack, HStack, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronLeftIcon } from '../icons';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, actions, backHref, children }: PageHeaderProps) {
  return (
    <Box as="header" mb={{ base: 4 }}>
      <Flex align="center" justify="space-between" gap={4} flexWrap="wrap">
        <VStack align="start" spacing={1}>
          {backHref && (
            <ChakraLink
              as={RouterLink}
              to={backHref}
              display="inline-flex"
              alignItems="center"
              gap={1}
              fontSize="sm"
              color="text.secondary"
              _hover={{ color: 'text.primary', textDecoration: 'none' }}
              mb={1}
            >
              <ChevronLeftIcon size={16} />
              Back
            </ChakraLink>
          )}
          <Heading as="h1" size="lg" color="text.primary">
            {title}
          </Heading>
          {description && (
            <Text color="text.secondary" fontSize="md" maxW="640px">
              {description}
            </Text>
          )}
        </VStack>

        {actions && (
          <HStack spacing={2} flexShrink={0}>
            {actions}
          </HStack>
        )}
      </Flex>

      {children && <Box mt={4}>{children}</Box>}
    </Box>
  );
}
