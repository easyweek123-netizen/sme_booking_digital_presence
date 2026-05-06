import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import type { SubscriptionSnapshot } from '../../types/billing.types';
import {
  cycleLabel,
  formatBillingDate,
  planLabel,
} from '../../utils/billingLabels';

interface CurrentPlanCardProps {
  subscription: SubscriptionSnapshot | null;
  loading: boolean;
  error: boolean;
  canceling: boolean;
  resuming: boolean;
  onUpgradeClick?: () => void;
  onCancel: () => void;
  onResume: () => void;
}

function getCardState(
  subscription: SubscriptionSnapshot | null,
): 'free' | 'active' | 'cancel-scheduled' | 'past-due' {
  if (!subscription) return 'free';
  if (subscription.status === 'past_due') return 'past-due';
  if (subscription.cancelAtPeriodEnd) return 'cancel-scheduled';
  return 'active';
}

export function CurrentPlanCard({
  subscription,
  loading,
  error,
  canceling,
  resuming,
  onUpgradeClick,
  onCancel,
  onResume,
}: CurrentPlanCardProps) {
  const cancelDialog = useDisclosure();
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);

  if (loading) {
    return (
      <CardShell>
        <Text color="text.secondary">Loading subscription…</Text>
      </CardShell>
    );
  }

  if (error) {
    return (
      <CardShell>
        <Text color="text.secondary">
          Unable to load your subscription right now.
        </Text>
      </CardShell>
    );
  }

  const state = getCardState(subscription);

  if (state === 'free') {
    return (
      <CardShell>
        <Flex justify="space-between" align="start" gap={4} flexWrap="wrap">
          <Box>
            <HStack spacing={2} mb={1}>
              <Text fontWeight="700" color="text.primary">
                Current plan: Free
              </Text>
              <Badge>Free</Badge>
            </HStack>
            <Text color="text.secondary" fontSize="sm">
              You're on the Free plan. Upgrade anytime to unlock more features.
            </Text>
          </Box>
          <Button colorScheme="brand" onClick={onUpgradeClick}>
            Upgrade
          </Button>
        </Flex>
      </CardShell>
    );
  }

  const sub = subscription!;
  const renewalText =
    state === 'cancel-scheduled'
      ? `Cancels on ${formatBillingDate(sub.currentPeriodEnd)}`
      : `Next renewal: ${formatBillingDate(sub.currentPeriodEnd)}`;

  const statusBadge =
    state === 'past-due' ? (
      <Badge colorScheme="red">Past due</Badge>
    ) : state === 'cancel-scheduled' ? (
      <Badge colorScheme="yellow">Cancel scheduled</Badge>
    ) : (
      <Badge colorScheme="green">Active</Badge>
    );

  return (
    <CardShell>
      {state === 'past-due' && (
        <Alert status="error" borderRadius="lg" mb={4}>
          <AlertIcon />
          <Box>
            <Text fontWeight="700">Payment issue</Text>
            <Text fontSize="sm">
              Update payment is not available yet in this build.
            </Text>
          </Box>
        </Alert>
      )}

      <Flex justify="space-between" align="start" gap={4} flexWrap="wrap">
        <Box>
          <HStack spacing={2} mb={1}>
            <Text fontWeight="700" color="text.primary">
              Current plan: {planLabel(sub.plan)}
            </Text>
            {statusBadge}
          </HStack>
          <Text color="text.secondary" fontSize="sm">
            {cycleLabel(sub.cycle)} • {renewalText}
          </Text>
        </Box>

        <HStack spacing={3}>
          {state === 'cancel-scheduled' ? (
            <Button variant="outline" onClick={onResume} isLoading={resuming}>
              Resume
            </Button>
          ) : (
            <Button
              variant="outline"
              colorScheme="red"
              onClick={cancelDialog.onOpen}
              isLoading={canceling}
            >
              Cancel
            </Button>
          )}
        </HStack>
      </Flex>

      <AlertDialog
        isOpen={cancelDialog.isOpen}
        leastDestructiveRef={cancelBtnRef}
        onClose={cancelDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="600">
              Cancel subscription
            </AlertDialogHeader>
            <AlertDialogBody>
              Your plan will remain active until the end of the current billing
              period.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelBtnRef} onClick={cancelDialog.onClose}>
                Keep plan
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  cancelDialog.onClose();
                  onCancel();
                }}
                isLoading={canceling}
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </CardShell>
  );
}

function CardShell({ children }: { children: ReactNode }) {
  return (
    <Box
      bg="surface.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      p={5}
    >
      {children}
    </Box>
  );
}
