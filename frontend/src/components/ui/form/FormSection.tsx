import { VStack, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <VStack spacing={4} align="stretch">
      {title && (
        <Heading size="sm" color="text.primary">
          {title}
        </Heading>
      )}
      {description && (
        <Text color="text.muted" fontSize="sm">
          {description}
        </Text>
      )}
      {children}
    </VStack>
  );
}
