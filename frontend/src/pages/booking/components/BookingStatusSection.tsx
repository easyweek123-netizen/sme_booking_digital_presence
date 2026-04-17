import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { BookingStatusCheck } from './BookingStatusCheck';

export function BookingStatusSection() {
  return (
    <Box as="section" id="booking-status" py={10}>
      <Container maxW="600px" px={6}>
        <Heading size="md" color="gray.900" mb={1} letterSpacing="-0.02em">
          Check Booking Status
        </Heading>
        <Text color="gray.500" fontSize="sm" mb={4}>
          Enter your reference code to check your booking
        </Text>
        {/* Reuse existing BookingStatusCheck but render it expanded by default */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px"
          borderColor="gray.100"
          p={5}
        >
          <BookingStatusCheckInline />
        </Box>
      </Container>
    </Box>
  );
}

/**
 * Inline version of BookingStatusCheck — always visible (no collapsible toggle).
 * Wraps the existing component but forces it open.
 */
function BookingStatusCheckInline() {
  return <BookingStatusCheck />;
}
