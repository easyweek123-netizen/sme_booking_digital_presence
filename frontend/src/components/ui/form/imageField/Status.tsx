import { Progress, Text, VStack } from '@chakra-ui/react';
import type { ImageField } from './types';

export function Status({ field }: { field: ImageField }) {
  if (!field.isUploading && !field.error) return null;
  return (
    <VStack align="stretch" spacing={1} mt={2}>
      {field.isUploading && (
        <Progress
          value={field.progress}
          size="xs"
          borderRadius="full"
          colorScheme="brand"
          hasStripe
          isAnimated
        />
      )}
      {field.error && (
        <Text fontSize="xs" color="orange.500">
          {field.error}
        </Text>
      )}
    </VStack>
  );
}
