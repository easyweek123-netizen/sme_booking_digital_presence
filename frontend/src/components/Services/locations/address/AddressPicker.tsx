import { Button, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { LocateIcon, MapPinIcon } from '../../../icons';
import { AddressSearchBox } from './AddressSearchBox';
import { AddressMap } from './AddressMap';
import { AddressEditableFields } from './AddressEditableFields';
import { useAddressSearch } from './useAddressSearch';
import type { AddressInput, ServiceFormInput } from '@bookeasy/shared';

export function AddressPicker() {
  const { control, setValue } = useFormContext<ServiceFormInput>();
  const location = useWatch({ control, name: 'location' });
  const address = location?.type === 'ADDRESS' ? location.data : null;

  const writeAddress = (next: AddressInput | null) => {
    setValue('location', { type: 'ADDRESS', locationId: null, data: next }, { shouldDirty: true });
  };

  const {
    query, onQueryChange, candidates, isFetching,
    onSelectCandidate, onPinChange,
    locate, isGeoLoading, geoSupported,
  } = useAddressSearch({ value: address, onChange: writeAddress });

  return (
    <VStack spacing={2} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xs" fontWeight="700" color="text.muted" textTransform="uppercase" letterSpacing="0.04em">
          Location address
        </Text>
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

      {address && (
        <>
          <AddressMap
            latitude={address.latitude} longitude={address.longitude}
            label={address.line1 || undefined}
            onPinChange={onPinChange}
          />
          <HStack spacing={1.5} justify="center" color="text.muted">
            <MapPinIcon size={14} />
            <Text fontSize="xs">Drag the pin or tap the map to set the exact spot</Text>
          </HStack>
          <AddressEditableFields
            draft={address}
            onChange={(key, value) => writeAddress({ ...address, [key]: value })}
          />
        </>
      )}
    </VStack>
  );
}
