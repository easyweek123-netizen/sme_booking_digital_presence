import { Text, VStack } from '@chakra-ui/react';
import { ConnectCalendar } from '../../../calendar/ConnectCalendar';

export function OnlineLocationOptions() {
  return (
    <>
      <VStack align="stretch" spacing={3} pb={2}>
        <ConnectCalendar showDisconnect={false} />
        <Text fontSize="sm" color="text.muted">
          A hangout link will be sent to you and your customer via email.
        </Text>
      </VStack>
    </>
  );
}
