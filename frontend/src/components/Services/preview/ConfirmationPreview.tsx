import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import {
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  MailIcon,
} from '../../icons';
import type { ServiceDraft } from './AppointmentCardPreview';

interface ConfirmationPreviewProps {
  draft: ServiceDraft;
}

export function ConfirmationPreview({ draft }: ConfirmationPreviewProps) {
  const tint = draft.color ?? 'var(--chakra-colors-brand-500)';
  return (
    <Box
      borderRadius="lg"
      borderWidth={1}
      borderColor="border.subtle"
      bg="surface.card"
      p={6}
      textAlign="center"
    >
      <VStack spacing={3}>
        <Box
          w={12}
          h={12}
          borderRadius="full"
          bg="success.soft"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="success.primary"
        >
          <CheckCircleIcon size={28} />
        </Box>
        <Text fontWeight="700" fontSize="lg" color="text.heading">
          You're booked!
        </Text>
        <Text fontSize="sm" color="text.secondary">
          We've sent a confirmation to your email.
        </Text>
      </VStack>

      <Box mt={5} p={3} borderRadius="md" bg="surface.muted" textAlign="left">
        <Text fontWeight="600" fontSize="sm" color="text.heading" mb={2}>
          {draft.name?.trim() || 'Your service'}
        </Text>
        <HStack spacing={2} color="text.muted" fontSize="sm">
          <CalendarIcon size={14} />
          <Text>Wed, 21 May 2026</Text>
        </HStack>
        <HStack spacing={2} color="text.muted" fontSize="sm" mt={1}>
          <ClockIcon size={14} />
          <Text>10:30 · {draft.durationMinutes ?? '—'} min</Text>
        </HStack>
        <HStack spacing={2} color="text.muted" fontSize="sm" mt={1}>
          <MailIcon size={14} />
          <Text>BK-A3X9</Text>
        </HStack>
      </Box>

      <Button mt={4} w="full" variant="outline" borderColor={tint} color={tint}>
        Add to calendar
      </Button>
    </Box>
  );
}
