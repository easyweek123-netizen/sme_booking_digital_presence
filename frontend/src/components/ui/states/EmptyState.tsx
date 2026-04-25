import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { SearchIcon } from '../../icons';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
}: EmptyStateProps) {
  const iconBoxSize = size === 'sm' ? '48px' : '64px';
  const iconSize = size === 'sm' ? 20 : 28;

  return (
    <Box p={{ base: 8, md: 12 }}>
      <VStack spacing={4} align="center">
        <Box
          bg={icon ? 'brand.50' : 'surface.muted'}
          color={icon ? 'brand.600' : 'text.muted'}
          w={iconBoxSize}
          h={iconBoxSize}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon ?? <SearchIcon size={iconSize} />}
        </Box>
        <Heading size="sm" color="text.primary" textAlign="center">
          {title}
        </Heading>
        {description && (
          <Text
            color="text.secondary"
            fontSize="sm"
            textAlign="center"
            maxW="360px"
          >
            {description}
          </Text>
        )}
        {action && (
          <Button variant={action.variant ?? 'solid'} onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </VStack>
    </Box>
  );
}
