import {
  Box,
  HStack,
  Text,
  Button,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { ClockIcon, MailIcon, CheckIcon, CloseIcon, NoteIcon } from '../icons';
import { formatTime, BOOKING_STATUS_CONFIG } from '../../constants';
import { formatBookingDate, formatPrice } from '../../utils/format';
import { useGetNotesQuery } from '../../store/api';
import type { Booking } from '../../types';

/** Same tab keys as dashboard bookings filter (drives which action row is shown). */
export type BookingCardListTab = 'requests' | 'upcoming' | 'completed' | 'cancelled';

export type BookingCardAllowedActions = {
  accept?: boolean;
  decline?: boolean;
  cancel?: boolean;
  complete?: boolean;
  noShow?: boolean;
};

interface DashboardBookingCardProps {
  booking: Booking;
  type: BookingCardListTab;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
  onComplete: () => void;
  onNoShow: () => void;
  onViewDetails: () => void;
  isLoading: boolean;
  /** When set, only buttons explicitly `true` are shown (e.g. chat proposal matching AI newStatus). */
  allowedActions?: BookingCardAllowedActions;
}

function showAction(
  allowed: BookingCardAllowedActions | undefined,
  key: keyof BookingCardAllowedActions,
): boolean {
  if (!allowed) return true;
  return allowed[key] === true;
}

export function DashboardBookingCard({
  booking,
  type,
  onAccept,
  onDecline,
  onCancel,
  onComplete,
  onNoShow,
  onViewDetails,
  isLoading,
  allowedActions,
}: DashboardBookingCardProps) {
  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
  const isRequest = type === 'requests';

  const { data: notes = [] } = useGetNotesQuery({ bookingId: booking.id });
  const notesCount = notes.length;

  return (
    <Box
      bg="surface.card"
      borderRadius="sm"
      border="1px"
      borderColor={isRequest ? statusConfig.bg : 'border.subtle'}
      borderLeftWidth={isRequest ? '4px' : '1px'}
      borderLeftColor={isRequest ? statusConfig.color : undefined}
      p={5}
      _hover={{ borderColor: isRequest ? statusConfig.color : 'border.subtle', boxShadow: 'sm' }}
      transition="all 0.2s"
      position="relative"
    >
      {isRequest && (
        <Text fontSize="xs" color="text.faint" position="absolute" top={3} right={4}>
          {formatBookingDate(booking.date)}
        </Text>
      )}

      <Flex justify="space-between" align="flex-start" mb={3}>
        <HStack spacing={3}>
          <Box
            w="48px"
            h="48px"
            bg={isRequest ? statusConfig.bg : 'brand.50'}
            borderRadius="sm"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={isRequest ? statusConfig.color : 'brand.500'}
          >
            <ClockIcon size={24} />
          </Box>
          <Box>
            <Text fontWeight="600" color="text.heading">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </Text>
            {!isRequest && (
              <Text fontSize="sm" color="text.muted">
                {formatBookingDate(booking.date)}
              </Text>
            )}
          </Box>
        </HStack>
        {!isRequest && (
          <Badge
            bg={statusConfig.bg}
            color={statusConfig.color}
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="full"
            fontWeight="600"
          >
            {statusConfig.label}
          </Badge>
        )}
      </Flex>

      <Box mb={3}>
        <Text fontWeight="500" color="text.heading" mb={1}>
          {booking.customerName}
        </Text>
        <HStack spacing={1} fontSize="sm" color="text.muted">
          <MailIcon size={14} />
          <Text>{booking.customerEmail}</Text>
        </HStack>
      </Box>

      {booking.service && (
        <Flex
          justify="space-between"
          align="center"
          py={2}
          px={3}
          bg="surface.alt"
          borderRadius="sm"
          mb={3}
        >
          <Text fontSize="sm" color="text.strong">
            {booking.service.name} · {booking.service.durationMinutes} min
          </Text>
          <Text fontSize="sm" fontWeight="600" color="text.heading">
            {formatPrice(Number(booking.service.price))}
          </Text>
        </Flex>
      )}

      <Flex justify="space-between" align="center" mb={3}>
        {booking.reference && (
          <Text fontSize="xs" color="text.faint">
            Ref: {booking.reference}
          </Text>
        )}
        <Button
          size="xs"
          variant="ghost"
          leftIcon={<NoteIcon size={12} />}
          color={notesCount > 0 ? 'brand.500' : 'gray.400'}
          onClick={onViewDetails}
          _hover={{ bg: 'brand.50', color: 'accent.hover' }}
        >
          {notesCount > 0 ? `${notesCount} note${notesCount !== 1 ? 's' : ''}` : 'Notes'}
        </Button>
      </Flex>

      {type === 'requests' && (
        <HStack spacing={2} justify="flex-end">
          {showAction(allowedActions, 'decline') && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="alert"
              leftIcon={<CloseIcon size={12} />}
              onClick={onDecline}
              isDisabled={isLoading}
            >
              Decline
            </Button>
          )}
          {showAction(allowedActions, 'accept') && (
            <Button
              size="sm"
              colorScheme="brand"
              leftIcon={<CheckIcon size={14} />}
              onClick={onAccept}
              isLoading={isLoading}
            >
              Accept
            </Button>
          )}
        </HStack>
      )}

      {type === 'upcoming' && (
        <HStack spacing={2} justify="flex-end">
          {showAction(allowedActions, 'noShow') && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={onNoShow}
              isDisabled={isLoading}
            >
              No-show
            </Button>
          )}
          {showAction(allowedActions, 'cancel') && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="alert"
              onClick={onCancel}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
          )}
          {showAction(allowedActions, 'complete') && (
            <Button
              size="sm"
              colorScheme="brand"
              leftIcon={<CheckIcon size={14} />}
              onClick={onComplete}
              isLoading={isLoading}
            >
              Complete
            </Button>
          )}
        </HStack>
      )}
    </Box>
  );
}
