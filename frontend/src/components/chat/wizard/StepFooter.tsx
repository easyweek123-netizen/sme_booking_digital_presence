import { Box, Button, HStack, Spinner, Text } from '@chakra-ui/react';

interface StepFooterProps { onBack: () => void; onNext?: () => void; onSave?: () => void; isLast?: boolean; saving: boolean; }

export function StepFooter({ onBack, onNext, onSave, isLast = true, saving }: StepFooterProps) {
  return (
    <HStack justify="flex-end" px={3} py={2} spacing={1} bg="surface.alt" borderTop="1px" borderColor="border.subtle">
      <Button type="button" variant="ghost" size="sm" color="text.secondary" onClick={onBack} isDisabled={saving}>← Back</Button>
      {isLast ? (
        <Button type="button" bg="accent.primary" color="surface.card" size="sm" _hover={{ bg: 'accent.hover' }} onClick={onSave} isDisabled={saving}>
          {saving ? <><Spinner size="xs" mr={2} />Saving…</> : <Text color="surface.card">Save</Text>}
        </Button>
      ) : (
        <Button type="button" 
          bg="accent.primary" 
          color="surface.card" 
          size="sm" 
          _hover={{ bg: 'accent.hover' }} 
          onClick={onNext} 
          isDisabled={saving}>

          <HStack spacing={1.5}>
            <Text color="surface.card">Next</Text>
            <Box as="span" fontSize="sm" opacity={0.7} aria-hidden>→</Box>
          </HStack>
        </Button>
      )}
    </HStack>
  );
}