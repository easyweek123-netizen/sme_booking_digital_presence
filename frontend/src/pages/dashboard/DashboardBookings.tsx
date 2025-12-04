import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
  Center,
  Badge,
  Button,
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
import { useState, useRef } from 'react';
import { useGetMyBusinessQuery } from '../../store/api/businessApi';
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
} from '../../store/api/bookingsApi';
import { CalendarIcon, ClockIcon, PhoneIcon, MailIcon, CheckIcon } from '../../components/icons';
import { formatTime } from '../../constants/booking';
import { formatBookingDate, formatPrice, getTodayString } from '../../utils/format';
import type { Booking } from '../../types';

export function DashboardBookings() {
  const toast = useToast();
  const { data: business } = useGetMyBusinessQuery();
  const [tabIndex, setTabIndex] = useState(0);

  // Get today's date for filtering
  const today = getTodayString();

  // Fetch bookings based on tab
  const { data: bookings, isLoading } = useGetBookingsQuery(
    {
      businessId: business?.id || 0,
      status: tabIndex === 2 ? 'CANCELLED' : tabIndex === 1 ? 'COMPLETED' : 'CONFIRMED',
      from: tabIndex === 0 ? today : undefined,
    },
    { skip: !business?.id }
  );

  if (!business) return null;

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" color="gray.900" mb={1}>
          Bookings
        </Heading>
        <Text color="gray.500">Manage your appointments</Text>
      </Box>

      <Tabs
        index={tabIndex}
        onChange={setTabIndex}
        colorScheme="brand"
        variant="soft-rounded"
      >
        <TabList gap={2}>
          <Tab
            _selected={{ bg: 'brand.500', color: 'white' }}
            fontWeight="500"
            fontSize="sm"
          >
            Upcoming
          </Tab>
          <Tab
            _selected={{ bg: 'brand.500', color: 'white' }}
            fontWeight="500"
            fontSize="sm"
          >
            Completed
          </Tab>
          <Tab
            _selected={{ bg: 'brand.500', color: 'white' }}
            fontWeight="500"
            fontSize="sm"
          >
            Cancelled
          </Tab>
        </TabList>

        <TabPanels mt={4}>
          <TabPanel p={0}>
            <BookingsList
              bookings={bookings || []}
              isLoading={isLoading}
              type="upcoming"
            />
          </TabPanel>
          <TabPanel p={0}>
            <BookingsList
              bookings={bookings || []}
              isLoading={isLoading}
              type="completed"
            />
          </TabPanel>
          <TabPanel p={0}>
            <BookingsList
              bookings={bookings || []}
              isLoading={isLoading}
              type="cancelled"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}

interface BookingsListProps {
  bookings: Booking[];
  isLoading: boolean;
  type: 'upcoming' | 'completed' | 'cancelled';
}

function BookingsList({ bookings, isLoading, type }: BookingsListProps) {
  const toast = useToast();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<'cancel' | 'complete'>('cancel');
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleAction = (booking: Booking, action: 'cancel' | 'complete') => {
    setSelectedBooking(booking);
    setActionType(action);
    onOpen();
  };

  const confirmAction = async () => {
    if (!selectedBooking) return;

    try {
      await updateStatus({
        id: selectedBooking.id,
        status: actionType === 'cancel' ? 'CANCELLED' : 'COMPLETED',
      }).unwrap();

      toast({
        title: actionType === 'cancel' ? 'Booking cancelled' : 'Booking completed',
        status: 'success',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Action failed',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
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
    return (
      <Box
        py={12}
        textAlign="center"
        bg="white"
        borderRadius="xl"
        border="1px"
        borderColor="gray.100"
      >
        <Box color="gray.300" display="inline-block" mb={3}>
          <CalendarIcon size={48} />
        </Box>
        <Text color="gray.500">
          {type === 'upcoming'
            ? 'No upcoming bookings'
            : type === 'completed'
            ? 'No completed bookings yet'
            : 'No cancelled bookings'}
        </Text>
      </Box>
    );
  }

  return (
    <>
      <VStack spacing={3} align="stretch">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            type={type}
            onCancel={() => handleAction(booking, 'cancel')}
            onComplete={() => handleAction(booking, 'complete')}
            isUpdating={isUpdating && selectedBooking?.id === booking.id}
          />
        ))}
      </VStack>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="600">
              {actionType === 'cancel' ? 'Cancel Booking' : 'Complete Booking'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {actionType === 'cancel'
                ? 'Are you sure you want to cancel this booking? This action cannot be undone.'
                : 'Mark this booking as completed?'}
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button
                colorScheme={actionType === 'cancel' ? 'red' : 'green'}
                onClick={confirmAction}
                isLoading={isUpdating}
              >
                Yes, {actionType === 'cancel' ? 'Cancel' : 'Complete'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

interface BookingCardProps {
  booking: Booking;
  type: 'upcoming' | 'completed' | 'cancelled';
  onCancel: () => void;
  onComplete: () => void;
  isUpdating: boolean;
}

function BookingCard({ booking, type, onCancel, onComplete, isUpdating }: BookingCardProps) {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="gray.100"
      p={5}
      _hover={{ borderColor: 'gray.200' }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="flex-start" mb={3}>
        <HStack spacing={3}>
          <Box
            w="48px"
            h="48px"
            bg="brand.50"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="brand.500"
          >
            <ClockIcon size={24} />
          </Box>
          <Box>
            <Text fontWeight="600" color="gray.900">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {formatBookingDate(booking.date)}
            </Text>
          </Box>
        </HStack>
        <Badge
          colorScheme={
            booking.status === 'CONFIRMED'
              ? 'green'
              : booking.status === 'COMPLETED'
              ? 'blue'
              : 'red'
          }
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="full"
        >
          {booking.status}
        </Badge>
      </Flex>

      <Box mb={3}>
        <Text fontWeight="500" color="gray.900" mb={1}>
          {booking.customerName}
        </Text>
        <HStack spacing={4} fontSize="sm" color="gray.500">
          <HStack spacing={1}>
            <MailIcon size={14} />
            <Text>{booking.customerEmail}</Text>
          </HStack>
          <HStack spacing={1}>
            <PhoneIcon size={14} />
            <Text>{booking.customerPhone}</Text>
          </HStack>
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

      {type === 'upcoming' && (
        <HStack spacing={2} justify="flex-end">
          <Button
            size="sm"
            variant="outline"
            colorScheme="green"
            leftIcon={<CheckIcon size={14} />}
            onClick={onComplete}
            isLoading={isUpdating}
          >
            Complete
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={onCancel}
            isLoading={isUpdating}
          >
            Cancel
          </Button>
        </HStack>
      )}
    </Box>
  );
}

