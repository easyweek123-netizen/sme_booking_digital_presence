import { Button, HStack } from '@chakra-ui/react';

export interface ProposalFormActionsProps {
  isDirty: boolean;
  isSaving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}

export function ProposalFormActions({
  isDirty,
  isSaving,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
}: ProposalFormActionsProps) {
  return (
    <HStack spacing={2} flexShrink={0}>
      <Button variant="ghost" size="xs" onClick={onCancel} isDisabled={isSaving}>
        Cancel
      </Button>
      <Button
        colorScheme="brand"
        size="xs"
        onClick={onConfirm}
        isLoading={isSaving}
        isDisabled={!isDirty}
      >
        {confirmLabel}
      </Button>
    </HStack>
  );
}
