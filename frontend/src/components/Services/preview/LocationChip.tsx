import type { ReactNode } from 'react';
import { HStack, Tag, Text } from '@chakra-ui/react';
import {
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
} from '../../icons';
import type { LocationTypeValue } from '../../../types';

export function LocationChip({ type }: { type?: LocationTypeValue }) {
  if (!type) return null;
  const map: Record<LocationTypeValue, { icon: ReactNode; label: string }> = {
    AT_BUSINESS: { icon: <MapPinIcon size={12} />, label: 'At my place' },
    ONLINE: { icon: <CalendarIcon size={12} />, label: 'Online' },
    PHONE: { icon: <PhoneIcon size={12} />, label: 'Phone' },
  };
  const cfg = map[type];
  return (
    <Tag size="sm" variant="subtle" colorScheme="gray">
      <HStack spacing={1}>
        {cfg.icon}
        <Text>{cfg.label}</Text>
      </HStack>
    </Tag>
  );
}
