import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { LocationSelect } from '../../Locations';
import type { ServiceFormInput } from '@bookeasy/shared';

export function Location() {
  const { control } = useFormContext<ServiceFormInput>();

  return (
    <Controller
      control={control}
      name="location"
      render={({ fieldState }) => (
        <FormControl isInvalid={!!fieldState.error}>
          <LocationSelect />
          {fieldState.error && (
            <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  );
}
