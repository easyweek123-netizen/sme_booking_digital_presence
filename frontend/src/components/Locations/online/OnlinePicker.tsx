import { Box, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { useGetCalendarStatusQuery } from '../../../store/api/calendarApi';
import { ConnectCalendar } from '../../calendar/ConnectCalendar';
import { CheckIcon, VideoIcon } from '../../icons';
import { IconTile } from '../../ui';

export function OnlinePicker() {
  const { data: calendarStatus, isLoading } = useGetCalendarStatusQuery();

  if (isLoading) return <Spinner size="sm" color="brand.500" />;

  const connected = !!calendarStatus?.connected && !!calendarStatus.calendarId;

  if (!connected) {
    return (
      <Box bg="surface.card" border="1px solid" borderColor="border.subtle" borderRadius="lg" p={4}>
        <HStack align="flex-start" spacing={3} mb={3}>
          <IconTile><VideoIcon size={20} /></IconTile>
          <VStack align="flex-start" spacing={0.5}>
            <Text fontWeight="700" fontSize="sm" color="text.heading">No calendar connected</Text>
            <Text fontSize="sm" color="text.muted">
              Connect Google Calendar to auto-create a Meet link for every online booking.
            </Text>
          </VStack>
        </HStack>
        <ConnectCalendar showDisconnect={false} />
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box bg="surface.card" border="1px solid" borderColor="border.subtle" borderRadius="md" p={4}>
        <Text fontSize="xs" color="text.muted" mb={0.5}>Connected calendar</Text>
        <Text fontSize="sm" fontWeight="600" color="text.heading">{calendarStatus.email}</Text>
        <HStack spacing={1.5} mt={2}>
          <Box color="feedback.success.fg"><CheckIcon size={14} /></Box>
          <Text fontSize="sm" color="feedback.success.fg">Calendar will be linked when you save the service.</Text>
        </HStack>
      </Box>
    </VStack>
  );
}
