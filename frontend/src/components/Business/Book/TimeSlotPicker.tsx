import { Box, Grid, Text } from '@chakra-ui/react';

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelect }: TimeSlotPickerProps) {
  if (slots.length === 0) {
    return (
      <Box
        bg="surface.card"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="14px"
        p={7}
        textAlign="center"
      >
        <Text fontSize="15px" fontWeight={600} mb={1} color="text.heading">
          Fully booked on this date
        </Text>
        <Text fontSize="13px" color="text.muted">
          Try another day or join the waitlist
        </Text>
      </Box>
    );
  }
  return (
    <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={2.5}>
      {slots.map((slot) => {
        const active = slot === selectedSlot;
        return (
          <Box
            key={slot}
            as="button"
            onClick={() => onSelect(slot)}
            py={3.5}
            borderRadius="12px"
            fontSize="15px"
            fontWeight={600}
            bg={active ? 'var(--brand-accent)' : 'surface.card'}
            color={active ? 'var(--brand-on-accent)' : 'text.heading'}
            border="1.5px solid"
            borderColor={active ? 'var(--brand-accent)' : 'border.subtle'}
            transition="all .15s"
          >
            {slot}
          </Box>
        );
      })}
    </Grid>
  );
}
