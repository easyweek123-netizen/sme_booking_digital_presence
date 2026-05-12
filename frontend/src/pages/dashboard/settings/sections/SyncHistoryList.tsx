import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useGetSyncLogQuery } from '../../../../store/api/calendarApi';
import { formatRelativeTime } from '../../../../utils/relativeTime';
import type { CalendarSyncLog } from '../../../../types/calendar.types';

const OPERATION_LABEL: Record<CalendarSyncLog['operation'], string> = {
  create_event: 'Created event',
  delete_event: 'Deleted event',
};

function StatusDot({ status }: { status: CalendarSyncLog['status'] }) {
  const color = status === 'success' ? 'green.500' : 'red.500';
  return (
    <Box w={2} h={2} borderRadius="full" bg={color} flexShrink={0} aria-label={status} />
  );
}

export function SyncHistoryList() {
  const { data, isLoading } = useGetSyncLogQuery({ limit: 10 });
  if (isLoading) return null;
  if (!data || data.length === 0) return null;

  return (
    <Box borderWidth="1px" borderRadius="lg" p={5}>
      <Heading size="sm" mb={3}>Sync history</Heading>
      <VStack align="stretch" spacing={2}>
        {data.map((event) => (
          <HStack key={event.id} justify="space-between" align="center">
            <HStack spacing={3} flex={1} minW={0}>
              <StatusDot status={event.status} />
              <Text fontSize="sm" color="text.primary">
                {OPERATION_LABEL[event.operation]}
              </Text>
              {event.status === 'error' && event.errorCode && (
                <Text fontSize="xs" color="red.500" noOfLines={1}>
                  {event.errorCode}
                </Text>
              )}
            </HStack>
            <Text fontSize="xs" color="text.muted" flexShrink={0}>
              {formatRelativeTime(event.createdAt)}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
