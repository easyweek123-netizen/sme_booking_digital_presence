import { Box, Flex, HStack, Heading, Text } from '@chakra-ui/react';
import { CalendarIcon, CheckIcon, ClockIcon, MapPinIcon } from '../../../icons';
import type { Business, Service } from '../../../../types';
import { BrandButton } from '../../brand';
import { endTimeFromSlot, formatDateLong } from '../../utils';

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
  return (
    <Flex flex="1" align="center" justify="center" p={6} minH="60vh">
      <Box
        w="100%"
        maxW="480px"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
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
          color="gray.900"
        >
          You're booked!
        </Heading>
        <Text color="gray.700" fontSize="md" lineHeight={1.5} m="0 0 24px">
          Your appointment for <strong>{service.name}</strong> on {formatDateLong(date)} at{' '}
          {slot} is confirmed. We've sent a confirmation to your email.
        </Text>
        <Box bg="gray.50" borderRadius="12px" p={4} mb={5} textAlign="left" color="gray.900">
          <HStack spacing={2.5} mb={2} fontSize="sm">
            <Box color="gray.500">
              <CalendarIcon size={14} />
            </Box>
            <Text as="span">{formatDateLong(date)}</Text>
          </HStack>
          <HStack spacing={2.5} mb={2} fontSize="sm">
            <Box color="gray.500">
              <ClockIcon size={14} />
            </Box>
            <Text as="span">
              {slot} – {endTimeFromSlot(slot, service.durationMinutes)}
            </Text>
          </HStack>
          {(business.address || business.city) && (
            <HStack spacing={2.5} fontSize="sm">
              <Box color="gray.500">
                <MapPinIcon size={14} />
              </Box>
              <Text as="span">
                {[business.address, business.city].filter(Boolean).join(', ')}
              </Text>
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
