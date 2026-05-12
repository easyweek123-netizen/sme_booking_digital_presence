import { Heading, Text, VStack, Box } from '@chakra-ui/react';
import { TimezoneSection } from './sections/TimezoneSection';
import { GoogleSyncSection } from './sections/GoogleSyncSection';

export function Calendar() {
  return (
    <Box maxW="640px">
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="md" mb={1}>
            Calendar
          </Heading>
          <Text color="text.secondary" fontSize="sm">
            Configure your timezone and connect Google Calendar for automatic sync.
          </Text>
        </Box>
        <TimezoneSection />
        <GoogleSyncSection />
      </VStack>
    </Box>
  );
}
