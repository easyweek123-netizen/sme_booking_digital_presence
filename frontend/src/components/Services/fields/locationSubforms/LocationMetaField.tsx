import { FormControl, FormErrorMessage, Input } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

interface LocationMetaFieldProps {
  name: string;
  placeholder: string;
  type?: string;
  isRequired?: boolean;
}

export function LocationMetaField({
  name,
  placeholder,
  type = 'text',
  isRequired,
}: LocationMetaFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error} isRequired={isRequired}>
          <Input
            size="sm"
            type={type}
            placeholder={placeholder}
            value={(field.value as string | undefined) ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
          {fieldState.error?.message && (
            <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  );
}
