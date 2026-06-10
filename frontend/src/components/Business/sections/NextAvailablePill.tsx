import { HStack, Skeleton, Text } from '@chakra-ui/react';
import { CalendarIcon } from '../../icons';
import { useNextAvailableSlot } from '../../../hooks/useNextAvailableSlot';
import { formatRelativeSlot } from '../utils/nextSlotFormat';
import type { BusinessWithServices } from '../../../types';
import type { OpenStatus } from '../utils';

interface Props {
  business: BusinessWithServices;
  status: OpenStatus;
}

export function NextAvailablePill({ business }: Props) {
  const { data, isLoading } = useNextAvailableSlot({
    showNextAvailable: business.showNextAvailable,
    services: business.services,
  });

  if (isLoading) return <Skeleton h="20px" w="180px" borderRadius="full" />;

  if (data) {
    return (
      <HStack
        spacing={1.5}
        px={2.5}
        py={1}
        borderRadius="full"
        bg="var(--brand-accent-wash)"
        color="var(--brand-accent)"
        fontSize="13px"
        fontWeight={600}
      >
        <CalendarIcon size={14} />
        <Text as="span">
          Next available · {formatRelativeSlot(data.start, business.timezone)}
        </Text>
      </HStack>
    );
  }

  return null;
}
