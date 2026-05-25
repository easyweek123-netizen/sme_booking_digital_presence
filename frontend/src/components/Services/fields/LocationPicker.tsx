import { Box, FormControl } from '@chakra-ui/react';
import { FormLabelWithTooltip } from '../../ui/form';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useBusiness } from '@/contexts/useBusiness';
import { LocationType } from '../../../constants/locationType';
import type { LocationTypeValue } from '../../../types';
import { Tiles } from './Tiles';
import { LOCATION_TYPE_TILES } from './tileOptions';
import { LOCATION_META_FIELD_CONFIG, resolveLocationMeta } from './locationMetaConfig';
import { OnlineLocationOptions } from './locationSubforms/OnlineLocationOptions';
import { LocationMetaField } from './locationSubforms/LocationMetaField';

interface LocationPickerProps {
  typeName?: string;
  metaName?: string;
}

export function LocationPicker({
  typeName = 'locationType',
  metaName = 'locationMeta',
}: LocationPickerProps) {
  const business = useBusiness();
  const { control, setValue, getValues } = useFormContext();
  const currentType = useWatch({ control, name: typeName }) as LocationTypeValue | undefined;
  const fieldConfig = currentType ? LOCATION_META_FIELD_CONFIG[currentType] : undefined;

  return (
    <FormControl>
      <FormLabelWithTooltip hint="Where the appointment will take place">
        Location
      </FormLabelWithTooltip>
      <Controller
        control={control}
        name={typeName}
        render={({ field }) => (
          <Tiles
            options={LOCATION_TYPE_TILES}
            value={field.value}
            onChange={(v) => {
              field.onChange(v);
              setValue(
                metaName,
                resolveLocationMeta(v, business, getValues(metaName) as Record<string, unknown> | null | undefined),
                { shouldDirty: true },
              );
            }}
            columns={{ base: 3 }}
          />
        )}
      />
      {fieldConfig && (
        <Box mt={3}>
          <LocationMetaField
            name={`${metaName}.${fieldConfig.metaKey}`}
            placeholder={fieldConfig.placeholder}
            type={fieldConfig.type}
            isRequired={fieldConfig.isRequired}
          />
        </Box>
      )}
      {currentType === LocationType.ONLINE && (
        <Box mt={3}>
          <OnlineLocationOptions />
        </Box>
      )}
    </FormControl>
  );
}
