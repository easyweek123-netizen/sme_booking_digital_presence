import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Textarea,
  Text,
} from '@chakra-ui/react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';

interface TextAreaFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  labelSuffix?: string;
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
  labelSuffix,
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
          <FormLabel
            display="flex"
            alignItems="baseline"
            justifyContent="space-between"
            gap={2}
            w="full"
          >
            <Text as="span" flex="1">
              {label}
              {labelSuffix && (
                <>
                  {' · '}
                  <Text as="span" fontWeight="normal" color="text.muted">
                    {labelSuffix}
                  </Text>
                </>
              )}
            </Text>
            {showCount && maxLength && (
              <Text as="span" fontSize="xs" color="text.muted" fontWeight="normal" flexShrink={0}>
                {String(field.value ?? '').length}/{maxLength}
              </Text>
            )}
          </FormLabel>
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
          ) : helperText && <FormHelperText mt={0}>{helperText}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
