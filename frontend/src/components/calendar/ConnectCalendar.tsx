import { Button, HStack, Tag } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import {
  useGetCalendarStatusQuery,
  useGetGoogleAuthUrlMutation,
  useDisconnectGoogleMutation,
} from '../../store/api/calendarApi';
import { useGetSubscriptionQuery } from '../../store/api/billingApi';
import { useOAuthRedirectToast } from '../../hooks/useOAuthRedirectToast';
import { useOAuthPopup } from '../../hooks/useOAuthPopup';
import { TOAST_DURATION } from '../../constants';
import { ProLock } from '../ProLock';

interface ConnectCalendarProps {
  /** Entitlement key forwarded to ProLock when the user is not Pro. */
  feature?: string;
  showDisconnect?: boolean;
  onConnected?: () => void;
}

/**
 * Manages the owner's Google Calendar connection.
 * Renders one of: ProLock (non-Pro), Connect button (Pro & disconnected),
 * or Connected tag + Disconnect button (Pro & connected).
 */
export function ConnectCalendar({
  feature = 'calendar.sync',
  showDisconnect = true,
  onConnected,
}: ConnectCalendarProps) {
  const { data: subscription } = useGetSubscriptionQuery();
  const isPro = !!subscription?.plan && subscription.plan !== 'free';

  const statusQuery = useGetCalendarStatusQuery();
  const [getAuthUrl, authState] = useGetGoogleAuthUrlMutation();
  const [disconnect, disconnectState] = useDisconnectGoogleMutation();
  const toast = useToast();
  const { open: openOAuthPopup } = useOAuthPopup({
    expectedMessageType: 'google-calendar-connected',
    windowName: 'google-oauth',
  });

  useOAuthRedirectToast({
    successTitle: 'Google Calendar connected',
    errorTitle: 'Failed to connect Google Calendar',
    onSuccess: statusQuery.refetch,
  });

  if (statusQuery.isLoading) return null;
  if (!isPro) return <ProLock feature={feature} />;

  const connected = !!statusQuery.data?.connected;

  const handleConnect = async (): Promise<void> => {
    try {
      const { authUrl } = await getAuthUrl().unwrap();

      openOAuthPopup({
        url: authUrl,
        onBlocked: () => {
          window.location.href = authUrl;
        },
        onResult: (result) => {
          if (result.status === 'success') {
            void statusQuery.refetch();
            toast({
              title: 'Google Calendar connected',
              status: 'success',
              duration: TOAST_DURATION.MEDIUM,
              position: 'top',
            });
            onConnected?.();
          } else if (result.reason !== 'cancelled') {
            toast({
              title: 'Failed to connect Google Calendar',
              description: result.reason,
              status: 'error',
              duration: TOAST_DURATION.LONG,
              position: 'top',
            });
          } else {
            void statusQuery.refetch();
          }
        },
      });
    } catch {
      toast({
        title: 'Could not start Google sign-in',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
        position: 'top',
      });
    }
  };

  const handleDisconnect = async (): Promise<void> => {
    try {
      await disconnect().unwrap();
      toast({
        title: 'Disconnected',
        status: 'info',
        duration: TOAST_DURATION.MEDIUM,
        position: 'top',
      });
    } catch {
      toast({
        title: 'Failed to disconnect',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
        position: 'top',
      });
    }
  };

  if (connected) {
    return (
      <HStack spacing={3}>
        <Tag colorScheme="green" size="sm">
          Connected
        </Tag>
        {showDisconnect && 
          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={handleDisconnect}
            isLoading={disconnectState.isLoading}
          >
          Disconnect
        </Button>}
      </HStack>
    );
  }

  return (
    <Button colorScheme="brand" onClick={handleConnect} isLoading={authState.isLoading}>
      Connect Google Calendar
    </Button>
  );
}
