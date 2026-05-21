import type { FocusEvent } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { useController, useFormContext } from 'react-hook-form';

export function Price() {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ control, name: 'price' });

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();
    if (v && /^\d+(\.\d{1,2})?$/.test(v)) {
      field.onChange(Number(v).toFixed(2));
    }
    field.onBlur();
  };

  return (
    <FormControl isInvalid={!!fieldState.error}>
      <FormLabel fontSize="sm" fontWeight="500" color="text.strong">
        Price
      </FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Text color="text.muted">€</Text>
        </InputLeftElement>
        <Input
          type="text"
          placeholder="0.00"
          pl={8}
          value={field.value ?? ''}
          onChange={(e) => field.onChange(e.target.value === '' ? null : e.target.value)}
          onBlur={onBlur}
        />
      </InputGroup>
      {fieldState.error?.message && (
        <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
      )}
    </FormControl>
  );
}
