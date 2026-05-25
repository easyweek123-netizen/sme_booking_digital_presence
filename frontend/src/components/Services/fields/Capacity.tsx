import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

interface CapacityProps {
  name?: string;
  label?: string;
  helperText?: string;
  min?: number;
}

export function Capacity({
  name = 'capacity',
  label = 'Capacity',
  helperText = 'Number of seats per session.',
  min = 2,
}: CapacityProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error}>
          <FormLabel fontSize="sm" fontWeight="500" color="text.strong">
            {label}
          </FormLabel>
          <NumberInput
            value={typeof field.value === 'number' ? field.value : min}
            min={min}
            onChange={(_, v) => field.onChange(Number.isFinite(v) ? v : min)}
            onBlur={field.onBlur}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {helperText && !fieldState.error && (
            <FormHelperText>{helperText}</FormHelperText>
          )}
          {fieldState.error?.message && (
            <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  );
}
