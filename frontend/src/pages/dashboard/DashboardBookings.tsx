import {
  Box,
  VStack,
  Badge,
  Button,
  ButtonGroup,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, type ReactNode } from 'react';
import { useBusiness } from '../../contexts/useBusiness';
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetPendingCountQuery,
} from '../../store/api/bookingsApi';
import { BookingDetailDrawer } from '../../components/BookingDetailDrawer';
import { DashboardBookingCard } from '../../components/Dashboard/DashboardBookingCard';
import {
  BookingStatusConfirmDialog,
  type BookingStatusDialogAction,
} from '../../components/Dashboard/BookingStatusConfirmDialog';
import { TOAST_DURATION } from '../../constants';
import { getTodayString } from '../../utils/format';
import type { Booking, BookingStatus } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonList, EmptyState } from '../../components/ui/states';
import {
  CalendarIcon,
  CheckCircleIcon,
  ActivityIcon,
  CloseIcon,
} from '../../components/icons';

const MotionBox = motion.create(Box);

const FILTER_OPTIONS = [
  { key: 'requests', label: 'Requests', status: 'PENDING' as const },
  { key: 'upcoming', label: 'Upcoming', status: 'CONFIRMED' as const },
  { key: 'completed', label: 'Completed', status: 'COMPLETED' as const },
  { key: 'cancelled', label: 'Cancelled', status: 'CANCELLED' as const },
] as const;

type FilterKey = (typeof FILTER_OPTIONS)[number]['key'];

const emptyConfig: Record<FilterKey, { icon: ReactNode; title: string; description: string }> = {
  requests: {
    icon: <CheckCircleIcon size={28} />,
    title: 'All caught up',
    description: 'No pending booking requests right now.',
  },
  upcoming: {
    icon: <CalendarIcon size={28} />,
    title: 'No upcoming bookings',
    description: 'Share your booking link to get started.',
  },
  completed: {
    icon: <ActivityIcon size={28} />,
    title: 'No completed bookings yet',
    description: 'Completed bookings will appear here.',
  },
  cancelled: {
    icon: <CloseIcon size={28} />,
    title: 'No cancelled bookings',
    description: 'Cancelled bookings will appear here.',
  },
};

export function DashboardBookings() {
  const business = useBusiness();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('requests');

  const { data: pendingData } = useGetPendingCountQuery(business.id);
  const pendingCount = pendingData?.count || 0;

  const today = getTodayString();

  const currentFilter = FILTER_OPTIONS.find((f) => f.key === activeFilter)!;

  const { data: bookings, isLoading } = useGetBookingsQuery({
    businessId: business.id,
    status: currentFilter.status,
    from: activeFilter === 'upcoming' ? today : undefined,
  });

  const { data: noShowBookings } = useGetBookingsQuery(
    {
      businessId: business.id,
      status: 'NO_SHOW',
    },
    { skip: activeFilter !== 'completed' },
  );

  const displayBookings =
    activeFilter === 'completed'
      ? [...(bookings || []), ...(noShowBookings || [])]
      : (bookings || []);

  return (
    <VStack spacing={6} align="stretch">
      <PageHeader title="Bookings" description="Manage your appointments" />

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
        <ButtonGroup isAttached size="sm" bg="surface.muted" borderRadius="lg" p="2px">
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.key;
            const isRequests = option.key === 'requests';

            return (
              <Button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                bg={isActive ? 'white' : 'transparent'}
                color={isActive ? 'text.primary' : 'text.secondary'}
                fontWeight={isActive ? '600' : '500'}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="md"
                boxShadow={isActive ? 'sm' : 'none'}
                _hover={{
                  bg: isActive ? 'white' : 'surface.muted',
                  color: 'text.primary',
                }}
                transition="all 0.2s"
                position="relative"
              >
                {option.label}
                {isRequests && pendingCount > 0 && (
                  <Badge
                    colorScheme="alert"
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

      <BookingsList bookings={displayBookings} isLoading={isLoading} type={activeFilter} />
    </VStack>
  );
}

interface BookingsListProps {
  bookings: Booking[];
  isLoading: boolean;
  type: FilterKey;
}

type RowActionType = 'accept' | 'decline' | 'cancel' | 'complete' | 'no_show';

function BookingsList({ bookings, isLoading, type }: BookingsListProps) {
  const toast = useToast();
  const [updateStatus] = useUpdateBookingStatusMutation();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<RowActionType>('cancel');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [mutatingBookingId, setMutatingBookingId] = useState<number | null>(null);

  const handleAction = (booking: Booking, action: RowActionType) => {
    setSelectedBooking(booking);
    setActionType(action);
    onAlertOpen();
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    onDrawerOpen();
  };

  const handleQuickAccept = async (booking: Booking) => {
    setMutatingBookingId(booking.id);
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
      setMutatingBookingId(null);
    }
  };

  const confirmAction = async () => {
    if (!selectedBooking) return;

    const id = selectedBooking.id;
    setMutatingBookingId(id);

    const statusMap: Record<RowActionType, BookingStatus> = {
      accept: 'CONFIRMED',
      decline: 'CANCELLED',
      cancel: 'CANCELLED',
      complete: 'COMPLETED',
      no_show: 'NO_SHOW',
    };

    try {
      await updateStatus({
        id,
        status: statusMap[actionType],
      }).unwrap();

      const messages: Record<RowActionType, string> = {
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
    } finally {
      setMutatingBookingId(null);
    }
  };

  const alertDialogAction: BookingStatusDialogAction =
    actionType === 'accept' ? 'cancel' : actionType;

  if (isLoading) {
    return <SkeletonList count={4} />;
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={emptyConfig[type].icon}
        title={emptyConfig[type].title}
        description={emptyConfig[type].description}
      />
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
                onAccept={() => void handleQuickAccept(booking)}
                onDecline={() => handleAction(booking, 'decline')}
                onCancel={() => handleAction(booking, 'cancel')}
                onComplete={() => handleAction(booking, 'complete')}
                onNoShow={() => handleAction(booking, 'no_show')}
                onViewDetails={() => handleViewDetails(booking)}
                isLoading={mutatingBookingId === booking.id}
              />
            </MotionBox>
          ))}
        </VStack>
      </AnimatePresence>

      <BookingStatusConfirmDialog
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        leastDestructiveRef={cancelRef}
        actionType={alertDialogAction}
        onConfirm={confirmAction}
        isConfirmLoading={mutatingBookingId !== null}
      />

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
