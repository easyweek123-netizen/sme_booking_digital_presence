import { Box, Heading, Text, VStack, Spinner, Center } from '@chakra-ui/react';
import { BookerVerification } from '../../../../components/Booking/BookerVerification';
import type { User } from '../../../../lib/firebase';

interface Props {
  businessName: string;
  isSubmitting: boolean;
  onVerified: (firebaseUser: User, name: string) => void;
  onError: (error: Error) => void;
}

export function DetailsStep({ businessName, isSubmitting, onVerified, onError }: Props) {
  return (
    <VStack align="stretch" spacing={0}>
      <Heading size="lg" color="text.heading" mb={2}>
        Your details
      </Heading>
      <Text color="text.muted" fontSize="md" mb={6}>
        We&apos;ll use this to confirm your booking.
      </Text>
      <Box
        bg="surface.card"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="xl"
        p={{ base: 4 }}
      >
        <BookerVerification
          onVerified={onVerified}
          onError={onError}
          businessName={businessName}
        />
        {isSubmitting && (
          <Center py={4} mt={4}>
            <VStack spacing={2}>
              <Spinner size="md" color="accent.primary" />
              <Text fontSize="sm" color="text.muted">
                Creating your booking…
              </Text>
            </VStack>
          </Center>
        )}
      </Box>
    </VStack>
  );
}
