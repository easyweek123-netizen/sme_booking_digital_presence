import {
  FormControl,
  FormErrorMessage,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormLabelWithTooltip } from '../../ui/form';

interface PauseAfterProps {
  name?: string;
  label?: string;
}

export function PauseAfter({
  name = 'pauseAfterMinutes',
  label = 'Pause after',
}: PauseAfterProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error}>
          <FormLabelWithTooltip
            hint="Buffer after each appointment before the next one can be booked"
            suffix="minutes"
          >
            {label}
          </FormLabelWithTooltip>
          <NumberInput
            value={typeof field.value === 'number' ? field.value : 0}
            min={0}
            onChange={(_, v) => field.onChange(Number.isFinite(v) ? v : 0)}
            onBlur={field.onBlur}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {fieldState.error?.message && (
            <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  );
}
