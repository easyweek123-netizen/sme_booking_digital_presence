import { useState } from 'react';
import { VStack, Text, Textarea, Button, HStack, Badge } from '@chakra-ui/react';

interface NoteProposalProps {
  content: string;
  customerName?: string;
  isUpdate?: boolean;
  onSubmit: (data: { content: string }) => void;
  onCancel: () => void;
}

/**
 * Canvas proposal component for creating or updating a note.
 * Shows an editable textarea with customer context and confirm/cancel buttons.
 */
export function NoteProposal({
  content,
  customerName,
  isUpdate = false,
  onSubmit,
  onCancel,
}: NoteProposalProps) {
  const [value, setValue] = useState(content);

  return (
    <VStack spacing={4} align="stretch">
      {customerName && (
        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.500">
            {isUpdate ? 'Update note for' : 'Note for'}
          </Text>
          <Badge colorScheme="blue" fontSize="sm" px={2} borderRadius="md">
            {customerName}
          </Badge>
        </HStack>
      )}

      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write a note..."
        rows={4}
        autoFocus
      />

      <HStack spacing={3} justify="flex-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          colorScheme="brand"
          size="sm"
          onClick={() => onSubmit({ content: value })}
          isDisabled={!value.trim()}
        >
          {isUpdate ? 'Update Note' : 'Add Note'}
        </Button>
      </HStack>
    </VStack>
  );
}
