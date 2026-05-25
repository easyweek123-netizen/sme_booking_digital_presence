import type { ReactNode } from 'react';
import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';

interface ProposalContentShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  tabs?: ReactNode;
  children: ReactNode;
}

export function ProposalContentShell({
  title,
  description,
  actions,
  tabs,
  children,
}: ProposalContentShellProps) {
  return (
    <Flex
      direction="column"
      h="full"
      bg="surface.card"
      borderRadius="sm"
      border="1px"
      borderColor="border.subtle"
      overflow="hidden"
    >
      <Box
        as="header"
        flexShrink={0}
        bg="surface.card"
        borderBottom="1px"
        borderColor="border.subtle"
        px={4}
        pt={3}
      >
        <Flex align="center" justify="space-between" gap={3} pb={tabs ? 2 : 3}>
          <VStack align="start" spacing={0} flex="1" minW={0}>
            <Heading size="sm" color="text.primary" noOfLines={1}>
              {title}
            </Heading>
            {description && (
              <Text fontSize="xs" color="text.muted" noOfLines={1}>
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
        {tabs && <Box pb={2}>{tabs}</Box>}
      </Box>

      <Box flex={1} minH={0} overflow="auto" p={4}>
        {children}
      </Box>
    </Flex>
  );
}
