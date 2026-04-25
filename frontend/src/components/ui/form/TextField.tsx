import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
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
}: TextFieldProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error} isRequired={isRequired}>
          <FormLabel>{label}</FormLabel>
          {leftAddon || rightAddon ? (
            <InputGroup size={size}>
              {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
              <Input
                {...field}
                value={field.value ?? ''}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
              />
              {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
            </InputGroup>
          ) : (
            <Input
              {...field}
              value={field.value ?? ''}
              type={type}
              placeholder={placeholder}
              size={size}
              autoComplete={autoComplete}
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
