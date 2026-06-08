import type { ReactNode } from 'react';
import { Box, Flex, VStack, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronLeftIcon } from '../icons';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
  onBackClick?: () => void;
  children?: ReactNode;
}

export function PageHeader({
  title, description, actions, backHref, onBackClick, children,
}: PageHeaderProps) {
  return (
    <Box as="header" mb={{ base: 4 }}>
      <Flex
        align="center"
        justify="space-between"
        gap={4}
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
      >
        <VStack align="start" spacing={1} flex="1" minW={0}>
          {backHref && (
            <ChakraLink
              as={RouterLink}
              to={backHref}
              onClick={onBackClick}
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
          <Heading as="h1" size="lg" color="text.primary" noOfLines={1}>
            {title}
          </Heading>
          {description && (
            <Text color="text.secondary" fontSize="md" maxW="640px">
              {description}
            </Text>
          )}
        </VStack>
        {actions && <>{actions}</>}
      </Flex>
      {children && <Box mt={4}>{children}</Box>}
    </Box>
  );
}
