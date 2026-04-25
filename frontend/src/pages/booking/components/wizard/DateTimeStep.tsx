import { Box, Heading, Text, VStack, Divider, Center, Spinner } from '@chakra-ui/react';
import { DateSelector } from '../../../../components/Booking/DateSelector';
import { TimeSlotGrid } from '../../../../components/Booking/TimeSlotGrid';
import { useGetAvailabilityQuery } from '../../../../store/api/bookingsApi';
import type { BusinessWithServices, Service } from '../../../../types';

interface Props {
  business: BusinessWithServices;
  service: Service;
  selectedDate: string;
  onDateChange: (d: string) => void;
  selectedTime: string | null;
  onSelectTime: (t: string) => void;
}

export function DateTimeStep({
  business,
  service,
  selectedDate,
  onDateChange,
  selectedTime,
  onSelectTime,
}: Props) {
  const { data, isLoading, isFetching } = useGetAvailabilityQuery({
    businessId: business.id,
    date: selectedDate,
    serviceId: service.id,
  });

  return (
    <VStack align="stretch" spacing={0}>
      <Heading size="lg" color="text.heading" mb={2}>
        Pick a date & time
      </Heading>
      <Text color="text.muted" fontSize="md" mb={6}>
        Available slots refresh when you change the date.
      </Text>

      <Box
        bg="surface.card"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="xl"
        overflow="hidden"
      >
        <Box p={{ base: 4 }}>
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            workingHours={business.workingHours}
          />
        </Box>
        <Divider />
        <Box p={{ base: 4 }}>
          {isLoading || isFetching ? (
            <Center py={10}>
              <VStack spacing={3}>
                <Spinner color="accent.primary" />
                <Text fontSize="sm" color="text.muted">
                  Loading available times…
                </Text>
              </VStack>
            </Center>
          ) : (
            <TimeSlotGrid
              slots={data?.slots || []}
              selectedTime={selectedTime}
              onSelectTime={onSelectTime}
            />
          )}
        </Box>
      </Box>
    </VStack>
  );
}
