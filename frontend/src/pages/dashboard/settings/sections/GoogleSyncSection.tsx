import { Box, Heading, Text, HStack, VStack } from '@chakra-ui/react';
import { useGetCalendarStatusQuery } from '../../../../store/api/calendarApi';
import { ConnectCalendar } from '../../../../components/calendar/ConnectCalendar';
import { formatRelativeTime } from '../../../../utils/relativeTime';
import { ReconnectBanner } from './ReconnectBanner';
import { SyncHistoryList } from './SyncHistoryList';

export function GoogleSyncSection() {
  const statusQuery = useGetCalendarStatusQuery();
  if (statusQuery.isLoading) return null;

  const inErrorState = statusQuery.data?.status === 'error';
  const connected = !!statusQuery.data?.connected;
  const email = statusQuery.data?.email;
  const lastSyncedLabel = formatRelativeTime(statusQuery.data?.lastSyncAt ?? null);

  return (
    <VStack align="stretch" spacing={4}>
      {inErrorState && <ReconnectBanner />}
      <Box borderWidth="1px" borderRadius="lg" p={5}>
        <HStack justify="space-between" align="start" spacing={4}>
          <VStack align="start" spacing={1} flex={1}>
            <Heading size="sm">Google Calendar</Heading>
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
          <ConnectCalendar />
        </HStack>
      </Box>
      <SyncHistoryList />
    </VStack>
  );
}
