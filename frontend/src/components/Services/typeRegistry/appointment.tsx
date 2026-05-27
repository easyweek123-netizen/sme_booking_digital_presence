import { HStack, Tag } from '@chakra-ui/react';
import { UserIcon } from '../../icons';
import { AppointmentCardPreview } from '../preview';
import type { ServiceDraft } from '../preview';
import type { ServiceTypeDefinition } from './types';

export const appointment: ServiceTypeDefinition = {
  label: 'Appointment',
  typeChipIcon: (
    <Tag size="sm" variant="subtle" colorScheme="purple">
      <HStack spacing={1}>
        <UserIcon size={12} />
      </HStack>
    </Tag>
  ),
  defaults: {
    capacity: 1,
    durationMinutes: 30,
    pauseAfterMinutes: 0,
  },
  Card: ({ draft }: { draft: ServiceDraft }) => (
    <AppointmentCardPreview draft={draft} />
  ),
};
