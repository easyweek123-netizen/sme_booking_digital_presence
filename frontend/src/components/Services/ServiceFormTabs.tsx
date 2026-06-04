import { Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { Availability, Basic, Location, Pricing } from './tabs';
import type { ServiceFormInput } from '@bookeasy/shared';
import type { ServiceTabKey } from './serviceTabs';

interface ServiceFormTabsProps {
  activeTab: ServiceTabKey;
}

export function ServiceFormTabs({ activeTab }: ServiceFormTabsProps) {
  const { watch } = useFormContext<ServiceFormInput>();
  const type = watch('type');

  return (
    <Box
      bg="surface.card"
      p={6}
      borderRadius="lg"
      borderWidth={1}
      borderColor="border.subtle"
    >
      {activeTab === 'basic' && <Basic type={type} />}
      {activeTab === 'location' && <Location />}
      {activeTab === 'availability' && <Availability type={type} />}
      {activeTab === 'pricing' && <Pricing />}
    </Box>
  );
}
