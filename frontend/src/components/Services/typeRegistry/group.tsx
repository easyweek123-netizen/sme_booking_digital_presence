import { HStack, Tag } from '@chakra-ui/react';
import { UsersIcon } from '../../icons';
import { GroupCardPreview } from '../preview';
import type { ServiceDraft } from '../preview';
import type { ServiceTypeDefinition } from './types';

export const group: ServiceTypeDefinition = {
  label: 'Group',
  typeChipIcon: (
    <Tag size="sm" variant="subtle" colorScheme="purple">
      <HStack spacing={1}>
        <UsersIcon size={12} />
      </HStack>
    </Tag>
  ),
  defaults: {
    capacity: 2,
    pauseAfterMinutes: 0,
    durationMinutes: 90,
  },
  Card: ({ draft }: { draft: ServiceDraft }) => <GroupCardPreview draft={draft} />,
};
