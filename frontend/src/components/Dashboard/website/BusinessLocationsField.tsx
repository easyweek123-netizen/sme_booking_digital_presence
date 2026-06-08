import { useMemo } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BusinessLocationSection } from './BusinessLocationSection';
import { BusinessLocationRow } from './BusinessLocationRow';
import { InfoBanner } from '../../ui';
import { emptyDraftForType } from '../../Locations';
import { PlusIcon } from '../../icons';
import type { LocationType } from '../../../types/location';
import type { WebsiteFormValues } from '../../../pages/dashboard/websiteForm.types';

const SECTIONS: Array<{ type: LocationType; addLabel: string; emptyHint: string }> = [
  { type: 'ADDRESS', addLabel: 'Add address', emptyHint: 'No addresses yet.' },
  { type: 'PHONE', addLabel: 'Add phone', emptyHint: 'No phone numbers yet.' },
  { type: 'ONLINE', addLabel: 'Add online channel', emptyHint: 'No online channels yet.' },
];

export function BusinessLocationsField() {
  const { control } = useFormContext<WebsiteFormValues>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'location.locations',
    keyName: '_key',
  });

  const indexByType = useMemo(() => {
    const out: Record<LocationType, Array<{ field: (typeof fields)[number]; index: number }>> = {
      ADDRESS: [],
      PHONE: [],
      ONLINE: [],
    };
    fields.forEach((field, index) => out[field.type].push({ field, index }));
    return out;
  }, [fields]);

  return (
    <VStack spacing={5} align="stretch">
      <InfoBanner>
        Turn on each channel your business uses. They appear as separate rows on your
        booking page under <Text as="span" fontWeight="700">How to reach us</Text>.
        Empty channels are hidden automatically.
      </InfoBanner>
      {SECTIONS.map(({ type, addLabel, emptyHint }) => {
        const rows = indexByType[type];
        // Derived expansion — no useState. Section is "open" if it has rows.
        const expanded = rows.length > 0;
        const onToggle = (next: boolean) => {
          if (!next) {
            // Switch off → mark all rows for deletion (drop from field array).
            // Deletes are persisted on Save in `useSaveBusinessLocations`.
            [...rows].reverse().forEach(({ index }) => remove(index));
          } else if (rows.length === 0) {
            append(emptyDraftForType(type));
          }
        };
        return (
          <BusinessLocationSection
            key={type}
            type={type}
            expanded={expanded}
            onToggle={onToggle}
          >
            <VStack align="stretch" spacing={0}>
              {rows.length === 0 ? (
                <Text fontSize="sm" color="text.muted" py={2}>
                  {emptyHint}
                </Text>
              ) : (
                rows.map(({ field, index }) => (
                  <BusinessLocationRow
                    key={field._key}
                    type={type}
                    value={field}
                    onChange={(next) => update(index, next)}
                    onRemove={() => remove(index)}
                  />
                ))
              )}
              <Box pt={2}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<PlusIcon size={14} />}
                  onClick={() => append(emptyDraftForType(type))}
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
