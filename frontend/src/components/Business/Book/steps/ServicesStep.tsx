import { VStack } from '@chakra-ui/react';
import type { BookingStepContext } from '../bookingFlow.types';
import { ServiceCard } from '../../ServiceCard';

export function ServicesStep({ flow, services }: BookingStepContext) {
  return (
    <VStack align="stretch" spacing={3}>
      {services.map((service) => {
        const isSelected = flow.state.service?.id === service.id;
        return (
          <ServiceCard
            key={service.id}
            service={service}
            selected={isSelected}
            variant="select"
            onSelect={() => {
              if (isSelected) flow.deselectService();
              else flow.selectService(service);
            }}
          />
        );
      })}
    </VStack>
  );
}
