import { Box, Flex, IconButton } from '@chakra-ui/react';
import { BusinessLocationPicker } from '../../Locations';
import { TrashIcon } from '../../icons';
import type { LocationDraft } from '@bookeasy/shared';
import type { LocationType } from '../../../types/location';

interface Props {
  type: LocationType;
  value: LocationDraft;
  onChange: (next: LocationDraft) => void;
  onRemove: () => void;
}

/**
 * Row layout:
 *   base: full-width picker, delete button below right
 *   md+:  picker + right-aligned delete in one row
 *
 * The leading "1." number was removed — the parent section header already
 * names the channel (In person / By phone / Online), and the backend's
 * (businessId, type) unique constraint means there's typically one row
 * per section anyway.
 */
export function BusinessLocationRow({ type, value, onChange, onRemove }: Props) {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align={{ base: 'stretch', md: 'flex-start' }}
      gap={2}
      py={3}
    >
      <Box flex={1} minW={0}>
        <BusinessLocationPicker
          type={type}
          value={value}
          onChange={(next) => onChange(next ?? value)}
        />
      </Box>
      <Flex justify={{ base: 'flex-end', md: 'flex-start' }}>
        <IconButton
          aria-label="Remove location"
          icon={<TrashIcon size={16} />}
          size="sm"
          variant="ghost"
          colorScheme="gray"
          onClick={onRemove}
        />
      </Flex>
    </Flex>
  );
}
