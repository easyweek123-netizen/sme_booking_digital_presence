import { useState, useRef } from 'react';
import { Center, Spinner, Text, VStack, Button } from '@chakra-ui/react';
import { useGetBookingQuery } from '../../store/api/bookingsApi';
import {
  DashboardBookingCard,
  type BookingCardAllowedActions,
  type BookingCardListTab,
} from '../Dashboard/DashboardBookingCard';
import { BookingStatusConfirmDialog, type BookingStatusDialogAction } from '../Dashboard/BookingStatusConfirmDialog';
import { BookingDetailDrawer } from '../BookingDetailDrawer';
import type { BookingStatusUpdateAction } from '@shared';
import type { Booking, BookingStatus } from '../../types';

function bookingStatusToCardTab(status: BookingStatus): BookingCardListTab {
  if (status === 'PENDING') return 'requests';
  if (status === 'CONFIRMED') return 'upcoming';
  if (status === 'COMPLETED' || status === 'NO_SHOW') return 'completed';
  return 'cancelled';
}

function allowedActionsForProposal(
  current: BookingStatus,
  next: BookingStatus,
): BookingCardAllowedActions | null {
  if (current === 'PENDING' && next === 'CONFIRMED') return { accept: true, decline: false };
  if (current === 'PENDING' && next === 'CANCELLED') return { accept: false, decline: true };
  if (current === 'CONFIRMED' && next === 'CANCELLED')
    return { cancel: true, complete: false, noShow: false };
  if (current === 'CONFIRMED' && next === 'COMPLETED')
    return { complete: true, cancel: false, noShow: false };
  if (current === 'CONFIRMED' && next === 'NO_SHOW')
    return { noShow: true, cancel: false, complete: false };
  return null;
}

interface DashboardBookingStatusActionProps {
  action: BookingStatusUpdateAction;
  onSubmit: (data: { confirmed: boolean }) => void | Promise<void>;
  onCancel: () => void;
}

/**
 * Chat canvas: same dashboard booking card + confirm dialog. PATCH runs in registry execute only.
 */
export function DashboardBookingStatusAction({
  action,
  onSubmit,
  onCancel,
}: DashboardBookingStatusActionProps) {
  const { data: booking, isLoading, isError } = useGetBookingQuery(action.resolvedId);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<BookingStatusDialogAction>('cancel');
  const [drawerBooking, setDrawerBooking] = useState<Booking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const commit = async () => {
    await onSubmit({ confirmed: true });
  };

  const openDialog = (a: BookingStatusDialogAction) => {
    setDialogAction(a);
    setIsAlertOpen(true);
  };

  const closeDialog = () => setIsAlertOpen(false);

  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner color="accent.primary" />
      </Center>
    );
  }

  if (isError || !booking) {
    return (
      <VStack spacing={3} align="stretch">
        <Text color="text.secondary">Could not load this booking.</Text>
        <Button onClick={onCancel}>Close</Button>
      </VStack>
    );
  }

  const allowed = allowedActionsForProposal(booking.status, action.newStatus);
  if (!allowed) {
    return (
      <VStack spacing={3} align="stretch">
        <Text color="text.secondary">
          This status change isn&apos;t available for the current booking state.
        </Text>
        <Button onClick={onCancel}>Close</Button>
      </VStack>
    );
  }

  const listTab = bookingStatusToCardTab(booking.status);

  return (
    <VStack spacing={4} align="stretch">
      <DashboardBookingCard
        booking={booking}
        type={listTab}
        allowedActions={allowed}
        onAccept={() => {
          void commit().catch(() => {
            /* Error toast from useProposalExecution */
          });
        }}
        onDecline={() => openDialog('decline')}
        onCancel={() => openDialog('cancel')}
        onComplete={() => openDialog('complete')}
        onNoShow={() => openDialog('no_show')}
        onViewDetails={() => {
          setDrawerBooking(booking);
          setDrawerOpen(true);
        }}
        isLoading={false}
      />

      <BookingStatusConfirmDialog
        isOpen={isAlertOpen}
        onClose={closeDialog}
        leastDestructiveRef={cancelRef}
        actionType={dialogAction}
        isConfirmLoading={false}
        onConfirm={async () => {
          try {
            await commit();
            closeDialog();
          } catch {
            /* Error toast from useProposalExecution; keep dialog open */
          }
        }}
      />

      {drawerBooking && (
        <BookingDetailDrawer
          booking={drawerBooking}
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setDrawerBooking(null);
          }}
        />
      )}

      <Button variant="ghost" size="sm" onClick={onCancel}>
        Cancel proposal
      </Button>
    </VStack>
  );
}
