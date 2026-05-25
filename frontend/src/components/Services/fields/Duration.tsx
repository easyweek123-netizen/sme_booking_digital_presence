import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  NumberInput,
  NumberInputField,
  VStack,
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormLabelWithTooltip } from '../../ui/form';

const PRESETS = [15, 30, 45, 60, 90];

interface DurationProps {
  name?: string;
  label?: string;
}

export function Duration({
  name = 'durationMinutes',
  label = 'Duration',
}: DurationProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const num = typeof field.value === 'number' ? field.value : 0;
        return (
          <FormControl isInvalid={!!fieldState.error}>
            <FormLabelWithTooltip
              hint="How long the customer book"
              suffix="minutes"
            >
              {label}
            </FormLabelWithTooltip>
            <VStack align="stretch" spacing={2}>
              <NumberInput
                value={num || ''}
                min={1}
                onChange={(_, v) => field.onChange(Number.isFinite(v) ? v : 0)}
                onBlur={field.onBlur}
              >
                <NumberInputField placeholder="e.g. 30" />
              </NumberInput>
              <HStack spacing={2} wrap="wrap">
                {PRESETS.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    size="xs"
                    variant={num === p ? 'solid' : 'outline'}
                    colorScheme={num === p ? 'brand' : undefined}
                    onClick={() => field.onChange(p)}
                  >
                    {p} min
                  </Button>
                ))}
              </HStack>
            </VStack>
            {fieldState.error?.message && (
              <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
            )}
          </FormControl>
        );
      }}
    />
  );
}
