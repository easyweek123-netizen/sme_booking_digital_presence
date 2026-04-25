import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Checkbox,
} from '@chakra-ui/react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';

interface CheckboxFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  helperText?: string;
}

export function CheckboxField<TFormValues extends FieldValues>({
  name,
  label,
  helperText,
}: CheckboxFieldProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error}>
          <Checkbox
            isChecked={!!field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            colorScheme="brand"
          >
            {label}
          </Checkbox>
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
