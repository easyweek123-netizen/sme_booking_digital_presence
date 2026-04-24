import {
  Box,
  HStack,
  Text,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { ClockIcon, NoteIcon } from '../icons';
import { BOOKING_STATUS_CONFIG, formatTime } from '../../constants';
import { formatBookingDate, formatPrice } from '../../utils/format';
import { CollapsibleSection } from '../CollapsibleSection';
import { NotesEditor } from '../NotesEditor';
import { useGetNotesQuery } from '../../store/api';
import type { Booking } from '../../types';

interface BookingCardProps {
  booking: Booking;
  showNotes?: boolean;
  variant?: 'full' | 'compact';
  onClick?: () => void;
}

export function BookingCard({
  booking,
  showNotes = false,
  variant = 'full',
  onClick,
}: BookingCardProps) {
  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
  const isCompact = variant === 'compact';

  // Only fetch notes count if showNotes is enabled
  const { data: notes = [] } = useGetNotesQuery(
    { bookingId: booking.id },
    { skip: !showNotes }
  );

  return (
    <Box
      bg="surface.card"
      p={isCompact ? 3 : 4}
      borderRadius="sm"
      border="1px"
      borderColor="border.subtle"
      borderLeftWidth="4px"
      borderLeftColor={statusConfig.color}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
      _hover={onClick ? { borderColor: 'border.strong', shadow: 'sm' } : undefined}
      transition="all 0.15s"
    >
      {/* Header: Reference + Status */}
      <Flex justify="space-between" align="center" mb={isCompact ? 2 : 3}>
        <Text fontSize="xs" color="text.faint" fontWeight="500">
          {booking.reference}
        </Text>
        <Badge
          bg={statusConfig.bg}
          color={statusConfig.color}
          fontSize="xs"
          px={2}
          py={0.5}
          borderRadius="lg"
          fontWeight="600"
        >
          {statusConfig.label}
        </Badge>
      </Flex>

      {/* Service Info */}
      {booking.service && (
        <Box mb={isCompact ? 2 : 3}>
          <Text fontWeight="600" color="text.heading" fontSize={isCompact ? 'sm' : 'md'}>
            {booking.service.name}
          </Text>
          <Text fontSize={isCompact ? 'xs' : 'sm'} color="text.muted">
            {booking.service.durationMinutes} min · {formatPrice(Number(booking.service.price))}
          </Text>
        </Box>
      )}

      {/* Date/Time */}
      <HStack spacing={4} fontSize={isCompact ? 'xs' : 'sm'} color="text.secondary" mb={showNotes ? 3 : 0}>
        <HStack spacing={1}>
          <ClockIcon size={isCompact ? 12 : 14} />
          <Text>
            {formatBookingDate(booking.date)} · {formatTime(booking.startTime)}
          </Text>
        </HStack>
      </HStack>

      {/* Notes Section (expandable) */}
      {showNotes && (
        <Box
          mt={3}
          pt={3}
          borderTopWidth="1px"
          borderTopColor="border.subtle"
        >
          <CollapsibleSection
            title="Notes"
            count={notes.length}
            icon={<NoteIcon size={14} />}
            defaultOpen={false}
          >
            <NotesEditor bookingId={booking.id} compact />
          </CollapsibleSection>
        </Box>
      )}
    </Box>
  );
}

