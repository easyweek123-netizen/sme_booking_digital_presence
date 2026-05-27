import { Box, Divider, Flex, HStack, Heading, Image, Text } from '@chakra-ui/react';
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  InfoIcon,
  ShieldIcon,
} from '../../../icons';
import { Stars } from '../../atoms';
import {
  endTimeFromSlot,
  formatDateLong,
  formatDuration,
  formatPrice,
} from '../../utils';
import { LoginCard } from '../LoginCard';
import type { BookingStepContext } from '../bookingFlow.types';

export function CheckoutStep({
  flow,
  business,
  isAuthenticated,
  userEmail,
  signingIn,
  onSignIn,
}: BookingStepContext) {
  const { service, date, slot } = flow.state;
  if (!service || !slot) return null;

  const rating = 5;
  const cancellationPolicy =
    'Cancel for free up to 24 hours before your appointment.';

  return (
    <Box>
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="14px" p={5}>
        <HStack spacing={3.5} align="center">
          {business.logoUrl && (
            <Image
              src={business.logoUrl}
              alt=""
              boxSize="56px"
              borderRadius="full"
              objectFit="cover"
            />
          )}
          <Box flex="1" minW={0}>
            <Text fontSize="15px" fontWeight={600} color="gray.900">
              {business.name}
            </Text>
            <Text fontSize="13px" color="gray.500" mt={0.5}>
              {[business.address, business.city].filter(Boolean).join(', ')}
            </Text>
            <Box mt={1}>
              <Stars rating={rating} size={12} />
            </Box>
          </Box>
        </HStack>

        <Divider my={4.5} />

        <Box fontSize="sm" color="gray.900">
          <HStack spacing={2.5} mb={2.5}>
            <Box color="gray.500">
              <CalendarIcon size={16} />
            </Box>
            <Text as="span">{formatDateLong(date)}</Text>
          </HStack>
          <HStack spacing={2.5}>
            <Box color="gray.500">
              <ClockIcon size={16} />
            </Box>
            <Text as="span">
              {slot} – {endTimeFromSlot(slot, service.durationMinutes)} (
              {formatDuration(service.durationMinutes)})
            </Text>
          </HStack>
        </Box>

        <Divider my={4.5} />

        <Flex justify="space-between" gap={3}>
          <Box minW={0}>
            <Text fontSize="15px" fontWeight={600} color="gray.900">
              {service.name}
            </Text>
            <Text fontSize="13px" color="gray.500" mt={0.5}>
              {formatDuration(service.durationMinutes)}
            </Text>
          </Box>
          <Text fontSize="15px" fontWeight={700} color="gray.900">
            {formatPrice(service)}
          </Text>
        </Flex>

        <Divider my={4.5} />

        <Flex justify="space-between" align="center">
          <Text fontSize="17px" fontWeight={700}>
            Total
          </Text>
          <Text fontSize="17px" fontWeight={700}>
            {formatPrice(service)}
          </Text>
        </Flex>
      </Box>

      {!isAuthenticated ? (
        <Box mt={4}>
          <LoginCard loading={signingIn} onGoogle={onSignIn} />
        </Box>
      ) : (
        <Flex
          mt={4}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="14px"
          p={4}
          gap={3}
          align="center"
        >
          <Flex
            w="36px"
            h="36px"
            borderRadius="full"
            bg="var(--brand-accent-soft)"
            color="var(--brand-accent)"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <CheckIcon size={16} />
          </Flex>
          <Box flex="1">
            <Text fontSize="sm" fontWeight={600} color="gray.900">
              {userEmail ? `Signed in as ${userEmail}` : 'Signed in'}
            </Text>
            <Text fontSize="13px" color="gray.500">
              You'll receive a confirmation email after booking.
            </Text>
          </Box>
        </Flex>
      )}

      <Heading
        as="h3"
        fontSize="18px"
        fontWeight={700}
        m="7 0 3"
        mt={7}
        mb={3}
        letterSpacing="-0.01em"
        color="gray.900"
      >
        More details
      </Heading>
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="14px" p={5}>
        <HStack align="flex-start" spacing={3}>
          <Box color="gray.500" mt="2px">
            <ShieldIcon size={16} />
          </Box>
          <Box>
            <Text fontSize="15px" fontWeight={600} mb={1} color="gray.900">
              Cancellation policy
            </Text>
            <Text fontSize="sm" color="gray.700" lineHeight={1.55}>
              {cancellationPolicy}
            </Text>
          </Box>
        </HStack>
      </Box>

      <HStack
        align="flex-start"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="14px"
        p={4}
        mt={3}
        spacing={2.5}
        fontSize="13px"
        color="gray.700"
      >
        <Box color="gray.500" flexShrink={0}>
          <InfoIcon size={16} />
        </Box>
        <Text as="span">
          By confirming this booking, you agree to the business's terms of service. You can
          manage your booking from your Book Easy account at any time.
        </Text>
      </HStack>
    </Box>
  );
}
