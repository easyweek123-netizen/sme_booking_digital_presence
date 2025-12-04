import { Box, SimpleGrid, Button, Text, VStack, Center } from '@chakra-ui/react';
import { CalendarIcon } from '../icons';
import { formatTime } from '../../constants/booking';

interface TimeSlotGridProps {
  slots: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

interface GroupedSlots {
  morning: string[];
  afternoon: string[];
  evening: string[];
}

export function TimeSlotGrid({ slots, selectedTime, onSelectTime }: TimeSlotGridProps) {
  if (slots.length === 0) {
    return (
      <Center py={12}>
        <VStack spacing={3}>
          <Box color="gray.300">
            <CalendarIcon size={48} />
          </Box>
          <Text color="gray.500" textAlign="center">
            No available times for this date.
            <br />
            <Text as="span" fontSize="sm">
              Try selecting a different date.
            </Text>
          </Text>
        </VStack>
      </Center>
    );
  }

  const grouped = groupSlotsByPeriod(slots);

  return (
    <VStack spacing={6} align="stretch">
      {grouped.morning.length > 0 && (
        <SlotSection
          title="Morning"
          slots={grouped.morning}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
        />
      )}
      {grouped.afternoon.length > 0 && (
        <SlotSection
          title="Afternoon"
          slots={grouped.afternoon}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
        />
      )}
      {grouped.evening.length > 0 && (
        <SlotSection
          title="Evening"
          slots={grouped.evening}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
        />
      )}
    </VStack>
  );
}

interface SlotSectionProps {
  title: string;
  slots: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

function SlotSection({ title, slots, selectedTime, onSelectTime }: SlotSectionProps) {
  return (
    <Box>
      <Text
        fontSize="sm"
        fontWeight="500"
        color="gray.500"
        mb={3}
        textTransform="uppercase"
      >
        {title}
      </Text>
      <SimpleGrid columns={4} spacing={2}>
        {slots.map((slot) => {
          const isSelected = slot === selectedTime;
          return (
            <Button
              key={slot}
              onClick={() => onSelectTime(slot)}
              size="md"
              h="48px"
              variant="unstyled"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="lg"
              border="2px"
              borderColor={isSelected ? 'brand.500' : 'gray.200'}
              bg={isSelected ? 'brand.500' : 'white'}
              color={isSelected ? 'white' : 'gray.700'}
              fontWeight="500"
              fontSize="sm"
              _hover={{
                borderColor: isSelected ? 'brand.500' : 'brand.300',
                bg: isSelected ? 'brand.500' : 'brand.50',
              }}
              _active={{
                transform: 'scale(0.98)',
              }}
              transition="all 0.15s"
            >
              {formatTime(slot)}
            </Button>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

function groupSlotsByPeriod(slots: string[]): GroupedSlots {
  const grouped: GroupedSlots = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  slots.forEach((slot) => {
    const hour = parseInt(slot.split(':')[0], 10);
    if (hour < 12) {
      grouped.morning.push(slot);
    } else if (hour < 17) {
      grouped.afternoon.push(slot);
    } else {
      grouped.evening.push(slot);
    }
  });

  return grouped;
}

