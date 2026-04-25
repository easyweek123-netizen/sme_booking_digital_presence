import { Box } from '@chakra-ui/react';
import { BookingSuccess } from '../../../../components/Booking/BookingSuccess';
import type { Booking, BusinessWithServices, Service } from '../../../../types';

interface Props {
  booking: Booking;
  service: Service;
  business: BusinessWithServices;
  onBookAnother: () => void;
  onClose: () => void;
}

export function ConfirmStep({ booking, service, business, onBookAnother, onClose }: Props) {
  return (
    <Box
      bg="surface.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      p={{ base: 4 }}
    >
      <BookingSuccess
        booking={booking}
        service={service}
        business={business}
        onBookAnother={onBookAnother}
        onClose={onClose}
      />
    </Box>
  );
}
