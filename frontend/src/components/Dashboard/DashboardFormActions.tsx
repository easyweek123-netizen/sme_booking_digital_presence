import type { ReactNode } from 'react';
import { Button, HStack } from '@chakra-ui/react';
export interface DashboardFormActionsProps {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  saveLabel?: string;
  /** Extra actions rendered before Discard (e.g. Delete button on edit pages). */
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
    <HStack spacing={2} flexShrink={0} flexWrap="nowrap">
      {startActions}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDiscard}
        color="text.muted"
        isDisabled={!isDirty}
        visibility={isDirty ? 'visible' : 'hidden'}
      >
        Discard
      </Button>
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
