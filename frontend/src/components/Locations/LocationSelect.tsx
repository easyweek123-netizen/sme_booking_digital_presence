import { Box, Collapse, Heading, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useListLocationsQuery } from '../../store/api/locationsApi';
import { SectionLabel } from '../ui';
import { BusinessLocationPicker } from './BusinessLocationPicker';
import { LocationDropdown } from './LocationDropdown';
import { Tiles } from '../Services/fields/Tiles';
import { LOCATION_TYPE_TILE_OPTIONS } from './locationTileOptions';
import { emptyDraftForType, locationToDraft } from './shared/locationDraft';
import type { ServiceFormInput } from '@bookeasy/shared';
import type { LocationDraft } from '@bookeasy/shared';
import type { LocationType, Location } from '../../types/location';

export interface LocationSelectProps {
  allowedTypes?: LocationType[];
}

const ALL_TYPES: LocationType[] = ['ADDRESS', 'PHONE', 'ONLINE'];

export function LocationSelect({ allowedTypes = ALL_TYPES }: LocationSelectProps) {
  const { control, setValue } = useFormContext<ServiceFormInput>();
  const location = useWatch({ control, name: 'location' }) ?? null;
  const activeKind = location?.type ?? 'ADDRESS';
  const selectedId = location?.locationId ?? null;

  const { data: locations = [], isLoading } = useListLocationsQuery();

  const handleTileClick = (type: LocationType) => {
    setValue('location', activeKind === type ? null : emptyDraftForType(type), { shouldDirty: true });
  };

  const handleLocationChange = (loc: Location | null) => {
    setValue('location', locationToDraft(loc), { shouldDirty: true });
  };

  const handleDraftChange = (next: LocationDraft | null) => {
    const detached = next ? { ...next, locationId: null } : null;
    setValue('location', detached, { shouldDirty: true });
  };

  if (isLoading) return <Spinner size="sm" color="brand.500" />;

  const visibleTypes = ALL_TYPES.filter((t) => allowedTypes.includes(t));
  const visibleOptions = LOCATION_TYPE_TILE_OPTIONS.filter((o) => visibleTypes.includes(o.value));
  const showPicker = activeKind !== null;

  return (
    <VStack spacing={5} align="stretch">
      <Box>
        <Heading size="md" color="text.heading">Where is this service delivered?</Heading>
        <Text fontSize="sm" color="text.muted" mt={1}>Reuse a saved location, or add a new one.</Text>
      </Box>

      <Box>
        <SectionLabel mb={2}>Your locations</SectionLabel>
        <LocationDropdown
          locations={locations}
          selectedId={selectedId}
          onPreview={handleLocationChange}
          onDeleted={(id) => {
            if (selectedId === id) setValue('location', null);
          }}
          isDisabled={locations.length === 0}
        />
      </Box>

      <HStack spacing={3} align="center">
        <Box flex={1} h="1px" bg="border.subtle" />
      </HStack>

      <Tiles
        options={visibleOptions}
        value={activeKind ?? undefined}
        onChange={handleTileClick}
        columns={{ base: 1, sm: visibleTypes.length }}
      />

      <Collapse in={showPicker} animateOpacity>
        {showPicker && activeKind !== null && (
          <Box bg="surface.page" border="1px solid" borderColor="border.subtle" borderRadius="lg" p={5}>
            <BusinessLocationPicker
              type={activeKind}
              value={location}
              onChange={handleDraftChange}
            />
          </Box>
        )}
      </Collapse>
    </VStack>
  );
}
