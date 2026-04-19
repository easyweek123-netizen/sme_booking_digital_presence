import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from '@chakra-ui/react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';

interface NumberFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  isRequired?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function NumberField<TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  helperText,
  isRequired,
  min,
  max,
  step,
  precision,
  size = 'md',
}: NumberFieldProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  const resolvedStep = step ?? (precision !== undefined ? Math.pow(10, -precision) : 1);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error} isRequired={isRequired}>
          <FormLabel>{label}</FormLabel>
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
            placeholder={placeholder}
            size={size}
            min={min}
            max={max}
            step={resolvedStep}
          />
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
