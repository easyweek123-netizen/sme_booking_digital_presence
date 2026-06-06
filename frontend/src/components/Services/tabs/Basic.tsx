import {
  Box,
  FormControl,
  FormErrorMessage,
  SimpleGrid,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormLabelWithTooltip, TextField } from '../../ui/form';
import { ServiceCategory } from '../fields/ServiceCategory';
import { ServiceColor } from '../fields/ServiceColor';
import { PhotoUrl } from '../fields/PhotoUrl';
import { ServiceType } from '../fields/ServiceType';
import { Capacity } from '../fields/Capacity';
import { PauseAfter } from '../fields/PauseAfter';
import { Duration } from '../fields/Duration';
import type { ServiceTypeValue } from '@/types';

interface BasicProps {
  type: ServiceTypeValue;
}

export function Basic({ type }: BasicProps) {
  const { control } = useFormContext();

  return (
    <Box>
      <ServiceType />

      <Box mt={4}>
        <TextField name="name" label="Service name" placeholder="e.g. Piano lesson" />
      </Box>

      <Box mt={4}>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => {
            const value = (field.value as string | null) ?? '';
            const len = value.length;
            const max = 750;
            return (
              <FormControl isInvalid={!!fieldState.error}>
                <FormLabelWithTooltip
                  hint="Describe your service in a few sentences. Customers will see this on your booking page"
                  suffix="Optional"
                >
                  Description
                </FormLabelWithTooltip>
                <Box position="relative">
                  <Textarea
                    value={value}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    onBlur={field.onBlur}
                    placeholder="30-minute one-on-one piano lessons over Google Meet. Beginners welcome."
                    maxLength={max}
                    minH="180px"
                    pr="60px"
                    rows={8}
                  />
                  <Text
                    position="absolute"
                    bottom={2}
                    right={3}
                    fontSize="xs"
                    color={len > max - 20 ? 'warning.primary' : 'text.muted'}
                  >
                    {len}/{max}
                  </Text>
                </Box>
                {fieldState.error?.message && (
                  <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
                )}
              </FormControl>
            );
          }}
        />
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
        <Duration />
        {type === 'APPOINTMENT' && <PauseAfter />}
        {type === 'GROUP' && <Capacity />}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
        <ServiceCategory />
        <ServiceColor />
      </SimpleGrid>

      <Box mt={4}>
        <PhotoUrl />
      </Box>
    </Box>
  );
}
