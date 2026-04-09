import type { RefObject } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

export type BookingStatusDialogAction = 'decline' | 'cancel' | 'complete' | 'no_show';

interface BookingStatusConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<HTMLButtonElement | null>;
  actionType: BookingStatusDialogAction;
  onConfirm: () => void | Promise<void>;
  isConfirmLoading: boolean;
}

/**
 * Same confirm copy as dashboard bookings list (decline / cancel / complete / no-show).
 */
export function BookingStatusConfirmDialog({
  isOpen,
  onClose,
  leastDestructiveRef,
  actionType,
  onConfirm,
  isConfirmLoading,
}: BookingStatusConfirmDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={leastDestructiveRef} onClose={onClose}>
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
            <Button ref={leastDestructiveRef} onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme={
                actionType === 'decline' || actionType === 'cancel'
                  ? 'red'
                  : actionType === 'no_show'
                    ? 'gray'
                    : 'green'
              }
              onClick={() => void onConfirm()}
              isLoading={isConfirmLoading}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
