import { VStack, Text, Button, HStack } from '@chakra-ui/react';

interface DeleteConfirmationProps {
  entityType: string;
  id: number;
  name: string;
  onSubmit: (id: number) => Promise<void>;
  onCancel: () => void;
}

/**
 * Reusable delete confirmation component for canvas actions.
 * Shows a confirmation message and Delete/Cancel buttons.
 */
export function DeleteConfirmation({
  entityType,
  id,
  name,
  onSubmit,
  onCancel,
}: DeleteConfirmationProps) {
  return (
    <VStack spacing={4} align="stretch">
      <Text color="gray.600">
        Are you sure you want to delete "{name}"? This action cannot be undone.
      </Text>
      <HStack spacing={3}>
        <Button
          colorScheme="red"
          onClick={() => onSubmit(id)}
          flex={1}
        >
          Delete {entityType}
        </Button>
        <Button variant="outline" onClick={onCancel} flex={1}>
          Cancel
        </Button>
      </HStack>
    </VStack>
  );
}

