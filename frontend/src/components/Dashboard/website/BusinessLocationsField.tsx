import { useMemo, useState } from 'react';
import { Box, Button, Text, useToast, VStack } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BusinessLocationSection } from './BusinessLocationSection';
import { BusinessLocationRow } from './BusinessLocationRow';
import { LocationTabInfoBanner } from './LocationTabInfoBanner';
import { useDeleteLocationMutation } from '../../../store/api/locationsApi';
import { emptyDraftForType } from '../../Services/locations/shared/locationDraft';
import { PlusIcon } from '../../icons';
import { TOAST_DURATION } from '../../../constants';
import type { LocationType } from '../../../types/location';
import type { WebsiteFormValues } from '../../../pages/dashboard/websiteForm.types';

const SECTIONS: Array<{ type: LocationType; addLabel: string; emptyHint: string }> = [
  { type: 'ADDRESS', addLabel: 'Add address', emptyHint: 'No addresses yet.' },
  { type: 'PHONE', addLabel: 'Add phone', emptyHint: 'No phone numbers yet.' },
  { type: 'ONLINE', addLabel: 'Add online channel', emptyHint: 'No online channels yet.' },
];

export function BusinessLocationsField() {
  const toast = useToast();
  const { control } = useFormContext<WebsiteFormValues>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'location.locations',
    keyName: '_key',
  });
  const [deleteLocation, { isLoading: isDeleting }] = useDeleteLocationMutation();

  const indexByType = useMemo(() => {
    const out: Record<LocationType, Array<{ field: (typeof fields)[number]; index: number }>> = {
      ADDRESS: [],
      PHONE: [],
      ONLINE: [],
    };
    fields.forEach((field, index) => out[field.type].push({ field, index }));
    return out;
  }, [fields]);

  const [expanded, setExpanded] = useState<Record<LocationType, boolean>>(() => ({
    ADDRESS: indexByType.ADDRESS.length > 0,
    PHONE: indexByType.PHONE.length > 0,
    ONLINE: indexByType.ONLINE.length > 0,
  }));

  const handleRemove = async (field: (typeof fields)[number], index: number) => {
    if (field.locationId != null) {
      try {
        await deleteLocation(field.locationId).unwrap();
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'data' in err
            ? (err as { data?: { message?: string } }).data?.message
            : undefined;
        toast({
          title: 'Could not remove location',
          description: message ?? 'This location may be in use by a service.',
          status: 'error',
          duration: TOAST_DURATION.MEDIUM,
        });
        return;
      }
    }
    remove(index);
  };

  return (
    <VStack spacing={5} align="stretch">
      <LocationTabInfoBanner />
      {SECTIONS.map(({ type, addLabel, emptyHint }) => {
        const rows = indexByType[type];
        return (
          <BusinessLocationSection
            key={type}
            type={type}
            expanded={expanded[type]}
            onToggle={(on) => setExpanded((s) => ({ ...s, [type]: on }))}
          >
            <VStack align="stretch" spacing={0} divider={undefined}>
              {rows.length === 0 ? (
                <Text fontSize="sm" color="text.muted" py={2}>
                  {emptyHint}
                </Text>
              ) : (
                rows.map(({ field, index }, i) => (
                  <BusinessLocationRow
                    key={field._key}
                    number={i + 1}
                    type={type}
                    value={field}
                    onChange={(next) => update(index, next)}
                    onRemove={() => handleRemove(field, index)}
                    isRemoving={isDeleting}
                  />
                ))
              )}
              <Box pt={2}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<PlusIcon size={14} />}
                  onClick={() => {
                    append(emptyDraftForType(type));
                    setExpanded((s) => ({ ...s, [type]: true }));
                  }}
                >
                  {addLabel}
                </Button>
              </Box>
            </VStack>
          </BusinessLocationSection>
        );
      })}
    </VStack>
  );
}
