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
          <Box color="text.faint">
            <CalendarIcon size={48} />
          </Box>
          <Text color="text.muted" textAlign="center" fontWeight="500">
            No available times for this date.
            <br />
            <Text as="span" fontSize="sm" color="gray.450" fontWeight="400">
              Try selecting a different date above.
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
        fontSize="xs"
        fontWeight="700"
        letterSpacing="0.08em"
        color="gray.400"
        mb={3.5}
        textTransform="uppercase"
      >
        {title}
      </Text>
      <SimpleGrid columns={{ base: 3, sm: 4 }} spacing={2.5}>
        {slots.map((slot) => {
          const isSelected = slot === selectedTime;
          return (
            <Button
              key={slot}
              onClick={() => onSelectTime(slot)}
              size="md"
              h="46px"
              variant="unstyled"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="xl"
              border="1px solid"
              borderColor={isSelected ? 'var(--brand-color, #6B46C1)' : '#ECECEC'}
              bg={isSelected ? 'var(--brand-color, #6B46C1)' : 'white'}
              color={isSelected ? 'white' : 'black'}
              fontWeight="700"
              fontSize="sm"
              boxShadow={isSelected ? '0 4px 10px rgba(107, 70, 193, 0.12)' : '0 2px 4px rgba(0, 0, 0, 0.01)'}
              _hover={{
                borderColor: isSelected ? 'var(--brand-color, #6B46C1)' : 'black',
                bg: isSelected ? 'var(--brand-color-dark, #53369B)' : 'gray.50',
                transform: 'translateY(-0.5px)',
              }}
              _active={{
                transform: 'scale(0.97)',
              }}
              transition="all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
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
