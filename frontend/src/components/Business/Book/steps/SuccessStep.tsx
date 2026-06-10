import { Box, Flex, HStack, Heading, Text } from '@chakra-ui/react';
import { CalendarIcon, CheckIcon, ClockIcon, MapPinIcon } from '../../../icons';
import type { Business, Service } from '../../../../types';
import { BrandButton } from '../../brand';
import { endTimeFromSlot, formatDateLong } from '../../utils';
import { businessAddressLine } from '../../utils/locationLookup';

interface SuccessStepProps {
  business: Business;
  service: Service;
  date: Date;
  slot: string;
  isDesktop: boolean;
  onDone: () => void;
}

export function SuccessStep({
  business,
  service,
  date,
  slot,
  isDesktop,
  onDone,
}: SuccessStepProps) {
  const addressLine = businessAddressLine(business);
  return (
    <Flex flex="1" align="center" justify="center" p={6} minH="60vh">
      <Box
        w="100%"
        maxW="480px"
        bg="surface.card"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="16px"
        p={isDesktop ? 8 : 6}
        textAlign="center"
      >
        <Flex
          w="64px"
          h="64px"
          mx="auto"
          mb={4}
          borderRadius="full"
          bg="var(--brand-accent-soft)"
          color="var(--brand-accent)"
          align="center"
          justify="center"
        >
          <CheckIcon size={28} />
        </Flex>
        <Heading
          as="h1"
          fontSize="26px"
          fontWeight={700}
          letterSpacing="-0.02em"
          m="0 0 8px"
          color="text.heading"
        >
          You're booked!
        </Heading>
        <Text color="text.strong" fontSize="md" lineHeight={1.5} m="0 0 24px">
          Your appointment for <strong>{service.name}</strong> on {formatDateLong(date)} at{' '}
          {slot} is confirmed. We've sent a confirmation to your email.
        </Text>
        <Box bg="surface.alt" borderRadius="12px" p={4} mb={5} textAlign="left" color="text.heading">
          <HStack spacing={2.5} mb={2} fontSize="sm">
            <Box color="text.muted">
              <CalendarIcon size={14} />
            </Box>
            <Text as="span">{formatDateLong(date)}</Text>
          </HStack>
          <HStack spacing={2.5} mb={2} fontSize="sm">
            <Box color="text.muted">
              <ClockIcon size={14} />
            </Box>
            <Text as="span">
              {slot} – {endTimeFromSlot(slot, service.durationMinutes)}
            </Text>
          </HStack>
          {addressLine && (
            <HStack spacing={2.5} fontSize="sm">
              <Box color="text.muted">
                <MapPinIcon size={14} />
              </Box>
              <Text as="span">{addressLine}</Text>
            </HStack>
          )}
        </Box>
        <HStack spacing={2.5} justify="center">
          <BrandButton brandVariant="outline" size="md">
            Add to calendar
          </BrandButton>
          <BrandButton size="md" onClick={onDone}>
            Done
          </BrandButton>
        </HStack>
      </Box>
    </Flex>
  );
}
