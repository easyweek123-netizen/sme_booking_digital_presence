import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import type { ServiceDraft } from './AppointmentCardPreview';

const FAKE_DATES = ['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'];
const FAKE_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
];

interface BookerPreviewProps {
  draft: ServiceDraft;
}

export function BookerPreview({ draft }: BookerPreviewProps) {
  const tint = draft.color ?? 'var(--chakra-colors-brand-500)';
  return (
    <Box
      borderRadius="lg"
      borderWidth={1}
      borderColor="border.subtle"
      bg="surface.card"
      p={4}
    >
      <Text fontWeight="700" fontSize="md" color="text.heading" mb={3}>
        {draft.name?.trim() || 'Service name'}
      </Text>

      <Text fontSize="xs" fontWeight="600" color="text.muted" mb={2}>
        SELECT A DATE
      </Text>
      <HStack spacing={2} overflowX="auto" mb={4} pb={2}>
        {FAKE_DATES.map((d, i) => (
          <Button
            key={d}
            size="sm"
            variant={i === 2 ? 'solid' : 'outline'}
            bg={i === 2 ? tint : undefined}
            color={i === 2 ? 'white' : undefined}
            flexShrink={0}
          >
            {d}
          </Button>
        ))}
      </HStack>

      <Text fontSize="xs" fontWeight="600" color="text.muted" mb={2}>
        SELECT A TIME
      </Text>
      <VStack align="stretch" spacing={2}>
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          {FAKE_SLOTS.map((s, i) => (
            <Button
              key={s}
              size="sm"
              variant={i === 3 ? 'solid' : 'outline'}
              bg={i === 3 ? tint : undefined}
              color={i === 3 ? 'white' : undefined}
            >
              {s}
            </Button>
          ))}
        </Box>
      </VStack>

      <Button mt={4} w="full" bg={tint} color="white" _hover={{ opacity: 0.9 }}>
        Continue
      </Button>
    </Box>
  );
}
