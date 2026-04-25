import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { AlertTriangleIcon } from '../../icons';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <Box p={{ base: 8, md: 12 }}>
      <VStack spacing={4} align="center">
        <Box
          bg="alert.50"
          color="alert.600"
          w="64px"
          h="64px"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <AlertTriangleIcon size={28} />
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
        {onRetry && (
          <Button variant="outline" onClick={onRetry} isLoading={isRetrying}>
            Try again
          </Button>
        )}
      </VStack>
    </Box>
  );
}
