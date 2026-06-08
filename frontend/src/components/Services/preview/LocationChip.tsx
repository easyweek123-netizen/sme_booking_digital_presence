import { HStack, Tag, Text } from '@chakra-ui/react';
import { LOCATION_TYPE_PRESENTATION } from '../../Locations/locationDisplay';
import type { LocationType } from '../../../types/location';

export function LocationChip({ type }: { type?: LocationType }) {
  if (!type) return null;
  const { Icon, typeLabel } = LOCATION_TYPE_PRESENTATION[type];
  return (
    <Tag size="sm" variant="subtle" colorScheme="gray">
      <HStack spacing={1}>
        <Icon size={12} />
        <Text>{typeLabel}</Text>
      </HStack>
    </Tag>
  );
}
