import { Alert, AlertIcon, Box, Button, HStack, Text, useToast } from '@chakra-ui/react';
import { useGetGoogleAuthUrlMutation } from '../../../../store/api/calendarApi';
import { TOAST_DURATION } from '../../../../constants';

export function ReconnectBanner() {
  const [getAuthUrl, authState] = useGetGoogleAuthUrlMutation();
  const toast = useToast();

  const handleReconnect = async (): Promise<void> => {
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

  return (
    <Alert status="warning" borderRadius="lg">
      <AlertIcon />
      <Box flex={1}>
        <Text fontWeight="semibold">Reconnect required</Text>
        <Text fontSize="sm">
          Sync stopped — your Google access was revoked or expired. Recent bookings did not sync.
        </Text>
      </Box>
      <HStack>
        <Button
          colorScheme="orange"
          size="sm"
          onClick={handleReconnect}
          isLoading={authState.isLoading}
        >
          Reconnect Google Calendar
        </Button>
      </HStack>
    </Alert>
  );
}
