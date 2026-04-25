import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';

interface CurrencyFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  currency?: '€' | '$' | string;
  helperText?: string;
  isRequired?: boolean;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function CurrencyField<TFormValues extends FieldValues>({
  name,
  label,
  currency = '€',
  helperText,
  isRequired,
  min = 0,
  max,
  size = 'md',
}: CurrencyFieldProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error} isRequired={isRequired}>
          <FormLabel>{label}</FormLabel>
          <InputGroup size={size}>
            <InputLeftElement pointerEvents="none">
              <Text color="text.muted" fontSize="md" userSelect="none">
                {currency}
              </Text>
            </InputLeftElement>
            <Input
              type="number"
              value={field.value ?? ''}
              onChange={(e) => {
                const val = e.target.valueAsNumber;
                field.onChange(isNaN(val) ? undefined : val);
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              placeholder="0.00"
              min={min}
              max={max}
              step={0.01}
              pl="2.5rem"
            />
          </InputGroup>
          {fieldState.error ? (
            <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
          ) : helperText ? (
            <FormHelperText>{helperText}</FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
}
