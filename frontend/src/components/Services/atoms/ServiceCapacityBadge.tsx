import { HStack, Text } from '@chakra-ui/react';
import { UserIcon, UsersIcon } from '../../icons';

export function ServiceCapacityBadge({ type }: { type: 'APPOINTMENT' | 'GROUP' }) {
  const isGroup = type === 'GROUP';
  return (
    <HStack
      spacing={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight={600}
    >
      {isGroup ? <UsersIcon size={12} /> : <UserIcon size={12} />}
      <Text color="inherit">{isGroup ? 'Group' : '1-on-1'}</Text>
    </HStack>
  );
}
