import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  Text,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';

interface TextFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  type?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  isRequired?: boolean;
  autoComplete?: string;
  size?: 'sm' | 'md' | 'lg';
  optionalBadge?: boolean;
}

export function TextField<TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  helperText,
  type = 'text',
  leftAddon,
  rightAddon,
  isRequired,
  autoComplete,
  size = 'md',
  optionalBadge,
}: TextFieldProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error} isRequired={isRequired}>
          <FormLabel>
            {label}
            {optionalBadge && (
              <Text as="span" fontSize="xs" color="text.muted" ml={2}>
                Optional
              </Text>
            )}
          </FormLabel>
          {leftAddon || rightAddon ? (
            <InputGroup size={size}>
              {leftAddon && (
                <InputLeftElement pointerEvents="none" color="text.muted">
                  {leftAddon}
                </InputLeftElement>
              )}
              <Input
                {...field}
                value={field.value ?? ''}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                borderRadius="md"
              />
              {rightAddon && (
                <InputRightElement pointerEvents="none" color="text.muted">
                  {rightAddon}
                </InputRightElement>
              )}
            </InputGroup>
          ) : (
            <Input
              {...field}
              value={field.value ?? ''}
              type={type}
              placeholder={placeholder}
              size={size}
              autoComplete={autoComplete}
              borderRadius="md"
            />
          )}
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
