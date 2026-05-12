import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  useToast,
  Tag,
} from '@chakra-ui/react';
import {
  useGetCalendarStatusQuery,
  useGetGoogleAuthUrlMutation,
  useDisconnectGoogleMutation,
} from '../../../../store/api/calendarApi';
import { useGetSubscriptionQuery } from '../../../../store/api/billingApi';
import { useOAuthRedirectToast } from '../../../../hooks/useOAuthRedirectToast';
import { TOAST_DURATION } from '../../../../constants';
import { ProLock } from '../../../../components/ProLock';
import { formatRelativeTime } from '../../../../utils/relativeTime';
import { ReconnectBanner } from './ReconnectBanner';
import { SyncHistoryList } from './SyncHistoryList';

export function GoogleSyncSection() {
  const { data: subscription } = useGetSubscriptionQuery();
  const isPro = !!subscription?.plan && subscription.plan !== 'free';

  const statusQuery = useGetCalendarStatusQuery();
  const [getAuthUrl, authState] = useGetGoogleAuthUrlMutation();
  const [disconnect, disconnectState] = useDisconnectGoogleMutation();
  const toast = useToast();

  useOAuthRedirectToast({
    successTitle: 'Google Calendar connected',
    errorTitle: 'Failed to connect Google Calendar',
    onSuccess: statusQuery.refetch,
  });

  const lastSyncedLabel = formatRelativeTime(statusQuery.data?.lastSyncAt ?? null);

  const handleConnect = async (): Promise<void> => {
    try {
      const { authUrl } = await getAuthUrl().unwrap();
      window.location.href = authUrl;
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

  if (statusQuery.isLoading) return null;

  const inErrorState = statusQuery.data?.status === 'error';
  const connected = !!statusQuery.data?.connected;
  const email = statusQuery.data?.email;

  return (
    <VStack align="stretch" spacing={4}>
      {inErrorState && <ReconnectBanner />}
      <Box borderWidth="1px" borderRadius="lg" p={5}>
        <HStack justify="space-between" align="start" spacing={4}>
          <VStack align="start" spacing={1} flex={1}>
            <HStack>
              <Heading size="sm">Google Calendar</Heading>
              {connected && (
                <Tag colorScheme="green" size="sm">
                  Connected
                </Tag>
              )}
            </HStack>
            {connected && email ? (
              <>
                <Text fontSize="sm" color="text.secondary">
                  Connected as {email}. Confirmed bookings sync to your primary calendar.
                </Text>
                {lastSyncedLabel && (
                  <Text fontSize="xs" color="text.muted">
                    Last synced {lastSyncedLabel}
                  </Text>
                )}
              </>
            ) : (
              <Text fontSize="sm" color="text.secondary">
                Push every confirmed booking to your Google Calendar automatically.
              </Text>
            )}
          </VStack>

          {!isPro ? (
            <ProLock feature="calendar.sync" />
          ) : connected ? (
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleDisconnect}
              isLoading={disconnectState.isLoading}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              colorScheme="brand"
              onClick={handleConnect}
              isLoading={authState.isLoading}
            >
              Connect Google Calendar
            </Button>
          )}
        </HStack>
      </Box>
      <SyncHistoryList />
    </VStack>
  );
}
