import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Center,
  Badge,
  Button,
  ButtonGroup,
  Flex,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useGetMyBusinessQuery } from '../../store/api/businessApi';
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetPendingCountQuery,
} from '../../store/api/bookingsApi';
import { ClockIcon, MailIcon, CheckIcon, CloseIcon, NoteIcon } from '../../components/icons';
import { BookingDetailDrawer } from '../../components/BookingDetailDrawer';
import { formatTime, BOOKING_STATUS_CONFIG, TOAST_DURATION } from '../../constants';
import { formatBookingDate, formatPrice, getTodayString } from '../../utils/format';
import { useGetNotesQuery } from '../../store/api';
import type { Booking, BookingStatus } from '../../types';

const MotionBox = motion.create(Box);

// Filter options for segmented control
const FILTER_OPTIONS = [
  { key: 'requests', label: 'Requests', status: 'PENDING' as const },
  { key: 'upcoming', label: 'Upcoming', status: 'CONFIRMED' as const },
  { key: 'completed', label: 'Completed', status: 'COMPLETED' as const },
  { key: 'cancelled', label: 'Cancelled', status: 'CANCELLED' as const },
] as const;

type FilterKey = typeof FILTER_OPTIONS[number]['key'];

export function DashboardBookings() {
  const { data: business } = useGetMyBusinessQuery();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('requests');

  // Get pending count for badge
  const { data: pendingData } = useGetPendingCountQuery(business?.id || 0, {
    skip: !business?.id,
  });
  const pendingCount = pendingData?.count || 0;

  // Get today's date for filtering
  const today = getTodayString();

  // Get current filter config
  const currentFilter = FILTER_OPTIONS.find(f => f.key === activeFilter)!;

  // Fetch bookings based on filter
  const { data: bookings, isLoading } = useGetBookingsQuery(
    {
      businessId: business?.id || 0,
      status: currentFilter.status,
      from: activeFilter === 'upcoming' ? today : undefined,
    },
    { skip: !business?.id }
  );

  // For Completed tab, also fetch NO_SHOW bookings
  const { data: noShowBookings } = useGetBookingsQuery(
    {
      businessId: business?.id || 0,
      status: 'NO_SHOW',
    },
    { skip: !business?.id || activeFilter !== 'completed' }
  );

  // Combine completed and no-show bookings
  const displayBookings = activeFilter === 'completed' 
    ? [...(bookings || []), ...(noShowBookings || [])]
    : (bookings || []);

  if (!business) return null;

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" color="gray.900" mb={1}>
          Bookings
        </Heading>
        <Text color="gray.500">Manage your appointments</Text>
      </Box>

      {/* Segmented Control */}
      <Box 
        overflowX="auto" 
        pb={2}
        mx={{ base: -4, md: 0 }}
        px={{ base: 4, md: 0 }}
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        <ButtonGroup 
          isAttached 
          size="sm"
          bg="gray.100"
          borderRadius="lg"
          p="2px"
        >
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.key;
            const isRequests = option.key === 'requests';
            
            return (
              <Button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                bg={isActive ? 'white' : 'transparent'}
                color={isActive ? 'gray.900' : 'gray.500'}
                fontWeight={isActive ? '600' : '500'}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="md"
                boxShadow={isActive ? 'sm' : 'none'}
                _hover={{
                  bg: isActive ? 'white' : 'gray.50',
                  color: 'gray.900',
                }}
                transition="all 0.2s"
                position="relative"
              >
                {option.label}
                {isRequests && pendingCount > 0 && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    ml={1.5}
                    fontSize="2xs"
                    minW="18px"
                    h="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {pendingCount}
                  </Badge>
                )}
              </Button>
            );
          })}
        </ButtonGroup>
      </Box>

      {/* Bookings List */}
      <BookingsList
        bookings={displayBookings}
        isLoading={isLoading}
        type={activeFilter}
      />
    </VStack>
  );
}

interface BookingsListProps {
  bookings: Booking[];
  isLoading: boolean;
  type: FilterKey;
}

function BookingsList({ bookings, isLoading, type }: BookingsListProps) {
  const toast = useToast();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'decline' | 'cancel' | 'complete' | 'no_show'>('cancel');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [loadingBookingId, setLoadingBookingId] = useState<number | null>(null);

  const handleAction = (booking: Booking, action: typeof actionType) => {
    setSelectedBooking(booking);
    setActionType(action);
    onAlertOpen();
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    onDrawerOpen();
  };

  const handleQuickAccept = async (booking: Booking) => {
    setLoadingBookingId(booking.id);
    try {
      await updateStatus({
        id: booking.id,
        status: 'CONFIRMED',
      }).unwrap();

      toast({
        title: 'Booking confirmed!',
        description: `${booking.customerName}'s appointment has been confirmed.`,
        status: 'success',
        duration: TOAST_DURATION.MEDIUM,
      });
    } catch {
      toast({
        title: 'Failed to confirm',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    } finally {
      setLoadingBookingId(null);
    }
  };

  const confirmAction = async () => {
    if (!selectedBooking) return;

    const statusMap: Record<typeof actionType, BookingStatus> = {
      accept: 'CONFIRMED',
      decline: 'CANCELLED',
      cancel: 'CANCELLED',
      complete: 'COMPLETED',
      no_show: 'NO_SHOW',
    };

    try {
      await updateStatus({
        id: selectedBooking.id,
        status: statusMap[actionType],
      }).unwrap();

      const messages: Record<typeof actionType, string> = {
        accept: 'Booking confirmed',
        decline: 'Booking declined',
        cancel: 'Booking cancelled',
        complete: 'Booking completed',
        no_show: 'Marked as no-show',
      };

      toast({
        title: messages[actionType],
        status: actionType === 'decline' || actionType === 'cancel' ? 'info' : 'success',
        duration: TOAST_DURATION.MEDIUM,
      });
      onAlertClose();
    } catch {
      toast({
        title: 'Action failed',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  if (isLoading) {
    return (
      <Center py={12}>
        <Spinner size="lg" color="brand.500" />
      </Center>
    );
  }

  if (bookings.length === 0) {
    const emptyMessages = {
      requests: { icon: '✓', title: 'All caught up!', subtitle: 'No pending booking requests' },
      upcoming: { icon: '📅', title: 'No upcoming bookings', subtitle: 'Share your booking link to get started' },
      completed: { icon: '✨', title: 'No completed bookings yet', subtitle: 'Completed bookings will appear here' },
      cancelled: { icon: '🚫', title: 'No cancelled bookings', subtitle: 'Cancelled bookings will appear here' },
    };

    const msg = emptyMessages[type];

    return (
      <Box
        py={12}
        textAlign="center"
        bg="white"
        borderRadius="xl"
        border="1px"
        borderColor="gray.100"
      >
        <Text fontSize="3xl" mb={2}>{msg.icon}</Text>
        <Text fontWeight="600" color="gray.700" mb={1}>
          {msg.title}
        </Text>
        <Text color="gray.500" fontSize="sm">
          {msg.subtitle}
        </Text>
      </Box>
    );
  }

  return (
    <>
      <AnimatePresence mode="popLayout">
        <VStack spacing={3} align="stretch">
          {bookings.map((booking, index) => (
            <MotionBox
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <DashboardBookingCard
                booking={booking}
                type={type}
                onAccept={() => handleQuickAccept(booking)}
                onDecline={() => handleAction(booking, 'decline')}
                onCancel={() => handleAction(booking, 'cancel')}
                onComplete={() => handleAction(booking, 'complete')}
                onNoShow={() => handleAction(booking, 'no_show')}
                onViewDetails={() => handleViewDetails(booking)}
                isLoading={loadingBookingId === booking.id || (isUpdating && selectedBooking?.id === booking.id)}
              />
            </MotionBox>
          ))}
        </VStack>
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="600">
              {actionType === 'decline' && 'Decline Booking'}
              {actionType === 'cancel' && 'Cancel Booking'}
              {actionType === 'complete' && 'Complete Booking'}
              {actionType === 'no_show' && 'Mark as No-Show'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {actionType === 'decline' && 'Are you sure you want to decline this booking request?'}
              {actionType === 'cancel' && 'Are you sure you want to cancel this booking?'}
              {actionType === 'complete' && 'Mark this booking as completed?'}
              {actionType === 'no_show' && 'Mark this customer as a no-show?'}
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={onAlertClose}>
                No
              </Button>
              <Button
                colorScheme={
                  actionType === 'decline' || actionType === 'cancel' ? 'red' :
                  actionType === 'no_show' ? 'gray' : 'green'
                }
                onClick={confirmAction}
                isLoading={isUpdating}
              >
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Booking Detail Drawer */}
      {selectedBooking && (
        <BookingDetailDrawer
          booking={selectedBooking}
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
        />
      )}
    </>
  );
}

interface DashboardBookingCardProps {
  booking: Booking;
  type: FilterKey;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
  onComplete: () => void;
  onNoShow: () => void;
  onViewDetails: () => void;
  isLoading: boolean;
}

function DashboardBookingCard({
  booking,
  type,
  onAccept,
  onDecline,
  onCancel,
  onComplete,
  onNoShow,
  onViewDetails,
  isLoading,
}: DashboardBookingCardProps) {
  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
  const isRequest = type === 'requests';

  // Fetch notes count for badge
  const { data: notes = [] } = useGetNotesQuery({ bookingId: booking.id });
  const notesCount = notes.length;

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor={isRequest ? statusConfig.bg : 'gray.100'}
      borderLeftWidth={isRequest ? '4px' : '1px'}
      borderLeftColor={isRequest ? statusConfig.color : undefined}
      p={5}
      _hover={{ borderColor: isRequest ? statusConfig.color : 'gray.200', boxShadow: 'sm' }}
      transition="all 0.2s"
      position="relative"
    >
      {/* Time badge for requests */}
      {isRequest && (
        <Text fontSize="xs" color="gray.400" position="absolute" top={3} right={4}>
          {formatBookingDate(booking.date)}
        </Text>
      )}

      <Flex justify="space-between" align="flex-start" mb={3}>
        <HStack spacing={3}>
          <Box
            w="48px"
            h="48px"
            bg={isRequest ? statusConfig.bg : 'brand.50'}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={isRequest ? statusConfig.color : 'brand.500'}
          >
            <ClockIcon size={24} />
          </Box>
          <Box>
            <Text fontWeight="600" color="gray.900">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </Text>
            {!isRequest && (
              <Text fontSize="sm" color="gray.500">
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
        <Text fontWeight="500" color="gray.900" mb={1}>
          {booking.customerName}
        </Text>
        <HStack spacing={1} fontSize="sm" color="gray.500">
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
          bg="gray.50"
          borderRadius="lg"
          mb={3}
        >
          <Text fontSize="sm" color="gray.700">
            {booking.service.name} · {booking.service.durationMinutes} min
          </Text>
          <Text fontSize="sm" fontWeight="600" color="gray.900">
            {formatPrice(Number(booking.service.price))}
          </Text>
        </Flex>
      )}

      {/* Reference code and notes */}
      <Flex justify="space-between" align="center" mb={3}>
        {booking.reference && (
          <Text fontSize="xs" color="gray.400">
            Ref: {booking.reference}
          </Text>
        )}
        <Button
          size="xs"
          variant="ghost"
          leftIcon={<NoteIcon size={12} />}
          color={notesCount > 0 ? 'blue.500' : 'gray.400'}
          onClick={onViewDetails}
          _hover={{ bg: 'blue.50', color: 'blue.600' }}
        >
          {notesCount > 0 ? `${notesCount} note${notesCount !== 1 ? 's' : ''}` : 'Notes'}
        </Button>
      </Flex>

      {/* Action buttons */}
      {type === 'requests' && (
        <HStack spacing={2} justify="flex-end">
          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            leftIcon={<CloseIcon size={12} />}
            onClick={onDecline}
            isDisabled={isLoading}
          >
            Decline
          </Button>
          <Button
            size="sm"
            colorScheme="green"
            leftIcon={<CheckIcon size={14} />}
            onClick={onAccept}
            isLoading={isLoading}
          >
            Accept
          </Button>
        </HStack>
      )}

      {type === 'upcoming' && (
        <HStack spacing={2} justify="flex-end">
          <Button
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={onNoShow}
            isDisabled={isLoading}
          >
            No-show
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={onCancel}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            colorScheme="green"
            leftIcon={<CheckIcon size={14} />}
            onClick={onComplete}
            isLoading={isLoading}
          >
            Complete
          </Button>
        </HStack>
      )}
    </Box>
  );
}
