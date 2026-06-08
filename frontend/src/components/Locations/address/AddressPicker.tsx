import { Button, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { SectionLabel } from '../../ui';
import { LocateIcon, MapPinIcon } from '../../icons';
import { AddressSearchBox } from './AddressSearchBox';
import { AddressMap } from './AddressMap';
import { AddressEditableFields } from './AddressEditableFields';
import { useAddressSearch } from './useAddressSearch';
import type { AddressInput } from '@bookeasy/shared';

interface AddressPickerProps {
  value: AddressInput | null;
  onChange: (next: AddressInput | null) => void;
}

export function AddressPicker({ value, onChange }: AddressPickerProps) {
  const {
    query, onQueryChange, candidates, isFetching,
    onSelectCandidate, onPinChange,
    locate, isGeoLoading, geoSupported,
  } = useAddressSearch({ value, onChange });

  return (
    <VStack spacing={2} align="stretch">
      <HStack justify="space-between">
        <SectionLabel>Location address</SectionLabel>
        <Button
          variant="ghost" size="xs" color="brand.600"
          leftIcon={isGeoLoading ? <Spinner size="xs" color="brand.500" /> : <LocateIcon size={14} />}
          isDisabled={isGeoLoading || !geoSupported}
          onClick={() => void locate()}
          px={1}
        >
          {isGeoLoading ? 'Locating…' : 'Use my location'}
        </Button>
      </HStack>

      <AddressSearchBox
        value={query}
        onQueryChange={onQueryChange}
        onSelect={onSelectCandidate}
        candidates={candidates}
        isFetching={isFetching}
      />

      {value && (
        <>
          <AddressMap
            latitude={value.latitude} longitude={value.longitude}
            label={value.line1 || undefined}
            onPinChange={onPinChange}
          />
          <HStack spacing={1.5} justify="center" color="text.muted">
            <MapPinIcon size={14} />
            <Text fontSize="xs">Drag the pin or tap the map to set the exact spot</Text>
          </HStack>
          <AddressEditableFields
            draft={value}
            onChange={(key, v) => onChange({ ...value, [key]: v })}
          />
        </>
      )}
    </VStack>
  );
}
