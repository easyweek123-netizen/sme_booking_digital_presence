import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Textarea,
  Text,
  Box,
} from '@chakra-ui/react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';

interface TextAreaFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  isRequired?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TextAreaField<TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  helperText,
  isRequired,
  rows,
  maxLength,
  showCount,
  size = 'md',
}: TextAreaFieldProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error} isRequired={isRequired}>
          <FormLabel>{label}</FormLabel>
          <Textarea
            {...field}
            value={field.value ?? ''}
            placeholder={placeholder}
            size={size}
            rows={rows}
            maxLength={maxLength}
          />
          {fieldState.error ? (
            <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
          ) : (
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
              {helperText && <FormHelperText mt={0}>{helperText}</FormHelperText>}
              {showCount && maxLength && (
                <Text fontSize="xs" color="text.muted" ml="auto">
                  {String(field.value ?? '').length}/{maxLength}
                </Text>
              )}
            </Box>
          )}
        </FormControl>
      )}
    />
  );
}
