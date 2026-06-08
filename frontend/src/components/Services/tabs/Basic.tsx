import { Box, SimpleGrid } from '@chakra-ui/react';
import { TextField, TextAreaField } from '../../ui/form';
import { ServiceCategory } from '../fields/ServiceCategory';
import { ServiceColor } from '../fields/ServiceColor';
import { PhotoUrl } from '../fields/PhotoUrl';
import { ServiceType } from '../fields/ServiceType';
import { Capacity } from '../fields/Capacity';
import { PauseAfter } from '../fields/PauseAfter';
import { Duration } from '../fields/Duration';
import { TEXT_LIMITS } from '../../../constants';
import type { ServiceFormInput } from '@bookeasy/shared';
import type { ServiceTypeValue } from '@/types';

interface BasicProps {
  type: ServiceTypeValue;
}

export function Basic({ type }: BasicProps) {
  return (
    <Box>
      <ServiceType />

      <Box mt={4}>
        <TextField<ServiceFormInput>
          name="name"
          label="Service name"
          placeholder="e.g. Piano lesson"
          size="lg"
        />
      </Box>

      <Box mt={4}>
        <TextAreaField<ServiceFormInput>
          name="description"
          label="Description"
          labelSuffix="Customers see this on your booking page"
          placeholder="30-minute one-on-one piano lessons over Google Meet. Beginners welcome."
          maxLength={TEXT_LIMITS.SERVICE_DESCRIPTION}
          showCount
          rows={8}
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
