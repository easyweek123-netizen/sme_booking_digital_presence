import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { BusinessLocationPicker } from '../../Locations/BusinessLocationPicker';
import { TrashIcon } from '../../icons';
import type { LocationDraft } from '@bookeasy/shared';
import type { LocationType } from '../../../types/location';

interface Props {
  number: number;
  type: LocationType;
  value: LocationDraft;
  onChange: (next: LocationDraft) => void;
  onRemove: () => void;
  isRemoving?: boolean;
}

export function BusinessLocationRow({
  number,
  type,
  value,
  onChange,
  onRemove,
  isRemoving,
}: Props) {
  return (
    <HStack align="flex-start" spacing={3} py={3}>
      <Text fontSize="sm" fontWeight="600" color="text.muted" mt={2} minW={5} textAlign="right">
        {number}.
      </Text>
      <Box flex={1} minW={0}>
        <BusinessLocationPicker
          type={type}
          value={value}
          onChange={(next) => onChange(next ?? value)}
        />
      </Box>
      <IconButton
        aria-label="Remove location"
        icon={<TrashIcon size={16} />}
        size="sm"
        variant="ghost"
        colorScheme="gray"
        isLoading={isRemoving}
        onClick={onRemove}
      />
    </HStack>
  );
}
