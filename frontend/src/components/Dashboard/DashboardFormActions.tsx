import type { ReactNode } from 'react';
import { Button, HStack } from '@chakra-ui/react';

export interface DashboardFormActionsProps {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  saveLabel?: string;
  startActions?: ReactNode;
}

export function DashboardFormActions({
  isDirty,
  isSaving,
  onSave,
  onDiscard,
  saveLabel = 'Save changes',
  startActions,
}: DashboardFormActionsProps) {
  return (
    <HStack spacing={2} flexShrink={1} flexWrap="wrap" justify="flex-end">
      {startActions}
      {isDirty && (
        <Button variant="ghost" size="sm" onClick={onDiscard} color="text.muted">
          Discard
        </Button>
      )}
      <Button
        colorScheme="brand"
        size="sm"
        onClick={onSave}
        isLoading={isSaving}
        isDisabled={!isDirty}
      >
        {saveLabel}
      </Button>
    </HStack>
  );
}
