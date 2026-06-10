import { Box, Button, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import {
  Controller, useFieldArray, useFormContext,
} from 'react-hook-form';
import type { LocationDraft } from '@bookeasy/shared';
import { BusinessLocationSection } from './BusinessLocationSection';
import { BusinessLocationPicker, emptyDraftForType } from '../../Locations';
import { InfoBanner } from '../../ui';
import { PlusIcon, TrashIcon } from '../../icons';
import type { WebsiteFormValues } from '../../../pages/dashboard/websiteForm.types';

type ArrayType = 'ADDRESS' | 'PHONE';

const ADD_LABEL: Record<ArrayType | 'ONLINE', string> = {
  ADDRESS: 'Add address',
  PHONE: 'Add phone',
  ONLINE: 'Add online channel',
};

interface FieldArrayHelpers {
  fields: { id: string }[];
  append: (value: LocationDraft) => void;
  remove: (index: number) => void;
}

export function BusinessLocationsField() {
  const { control } = useFormContext<WebsiteFormValues>();
  const addresses = useFieldArray({ control, name: 'location.byType.ADDRESS' });
  const phones = useFieldArray({ control, name: 'location.byType.PHONE' });

  const arraySections: ReadonlyArray<{ type: ArrayType; array: FieldArrayHelpers }> = [
    { type: 'ADDRESS', array: addresses },
    { type: 'PHONE', array: phones },
  ];

  return (
    <VStack spacing={5} align="stretch">
      <InfoBanner>
        Turn on each channel your business uses. They appear as separate rows on your
        booking page under <Text as="span" fontWeight="700">How to reach us</Text>.
        Empty channels are hidden automatically.
      </InfoBanner>

      {arraySections.map(({ type, array }) => (
        <BusinessLocationSection
          key={type}
          type={type}
          actions={
            <Button
              size="sm"
              variant="outline"
              leftIcon={<PlusIcon size={14} />}
              onClick={() => array.append(emptyDraftForType(type))}
            >
              {ADD_LABEL[type]}
            </Button>
          }
        >
          {array.fields.length === 0 ? null : (
            <VStack spacing={4} align="stretch">
              {array.fields.map((f, i) => (
                <Controller
                  key={f.id}
                  control={control}
                  name={`location.byType.${type}.${i}`}
                  render={({ field }) => (
                    <HStack align="flex-start" spacing={2}>
                      <Box flex={1} minW={0}>
                        <BusinessLocationPicker
                          type={type}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </Box>
                      <IconButton
                        aria-label={`Remove ${type.toLowerCase()}`}
                        icon={<TrashIcon size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="gray"
                        onClick={() => array.remove(i)}
                      />
                    </HStack>
                  )}
                />
              ))}
            </VStack>
          )}
        </BusinessLocationSection>
      ))}

      <Controller
        control={control}
        name="location.byType.ONLINE"
        render={({ field }) => (
          <BusinessLocationSection
            type="ONLINE"
            actions={
              field.value ? (
                <IconButton
                  aria-label="Remove online channel"
                  icon={<TrashIcon size={16} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  onClick={() => field.onChange(null)}
                />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<PlusIcon size={14} />}
                  onClick={() => field.onChange(emptyDraftForType('ONLINE'))}
                >
                  {ADD_LABEL.ONLINE}
                </Button>
              )
            }
          >
            {field.value ? (
              <BusinessLocationPicker
                type="ONLINE"
                value={field.value}
                onChange={field.onChange}
              />
            ) : null}
          </BusinessLocationSection>
        )}
      />
    </VStack>
  );
}
