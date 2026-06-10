import { HStack, Text } from '@chakra-ui/react';
import { ClockIcon } from '../../icons';
import type { OpenStatus } from '../utils';

export function StatusInline({ status }: { status: OpenStatus }) {
  return (
    <HStack
      as="span"
      spacing={1.5}
      color={status.open ? 'feedback.success.fg' : 'orange.500'}
      fontWeight={500}
      fontSize="sm"
    >
      <ClockIcon size={14} />
      <Text as="span">{status.line}</Text>
    </HStack>
  );
}
