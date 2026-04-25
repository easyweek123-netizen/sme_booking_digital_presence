import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
} from '@chakra-ui/react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  isRequired?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SelectField<TFormValues extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  helperText,
  isRequired,
  size = 'md',
}: SelectFieldProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error} isRequired={isRequired}>
          <FormLabel>{label}</FormLabel>
          <Select {...field} value={field.value ?? ''} size={size} placeholder={placeholder}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
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
