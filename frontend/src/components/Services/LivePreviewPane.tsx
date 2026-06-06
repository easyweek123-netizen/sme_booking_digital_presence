import { Box, HStack, Text } from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { Service } from '../../types';
import { ServiceCard as BusinessServiceCard } from '../Business/ServiceCard';

import { BrandProvider } from '../Business/brand';
import { servicePreviewDraft } from './helpers';
import type { ServiceDraft } from './types';
import { useParams } from 'react-router-dom';


const previewBook = () => {
  // eslint-disable-next-line no-alert
  alert('Customer will book from here');
};

function useEditingServiceId(): number | undefined {
  const { id } = useParams<{ id: string }>();
  if (!id) return undefined;
  const n = Number(id);
  return Number.isFinite(n) ? n : undefined;
}

export function LivePreviewPane() {
  const { control } = useFormContext();
  const draft = useWatch({ control }) as ServiceDraft;
  const serviceId = useEditingServiceId();
  const base = servicePreviewDraft(draft, serviceId);
  const service: Service = serviceId != null ? { ...base, id: serviceId } : base;

  return (
    <Box>
      <HStack justify="flex-start" align="center" mb={4}>
          <Box w={2} h={2} borderRadius="full" bg="sage.500" />
          <Text fontSize="xs" fontWeight={700} color="text.heading" letterSpacing="wider">PREVIEW</Text>
      </HStack>

      <BrandProvider brandColor={service.color ?? undefined}>
        <BusinessServiceCard service={service} onBook={previewBook} />
      </BrandProvider>
    </Box>
  );
}
