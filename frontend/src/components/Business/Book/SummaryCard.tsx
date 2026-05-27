import { Box, Divider, Flex, HStack, Image, Text } from '@chakra-ui/react';
import { CalendarIcon, ClockIcon } from '../../icons';
import type { Business, Service } from '../../../types';
import {
  endTimeFromSlot,
  formatDateLong,
  formatDuration,
  formatPrice,
  getInitials,
} from '../utils';

interface SummaryCardProps {
  business: Business;
  service: Service;
  date: Date;
  slot: string | null;
  step: number;
}

export function SummaryCard({ business, service, date, slot, step }: SummaryCardProps) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="12px"
      p={4}
      position="sticky"
      top="96px"
    >
      <HStack spacing={3}>
        <Box
          boxSize="40px"
          borderRadius="8px"
          overflow="hidden"
          bg="gray.100"
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {business.logoUrl ? (
            <Image src={business.logoUrl} alt="" w="100%" h="100%" objectFit="cover" />
          ) : (
            <Text fontSize="14px" fontWeight={700} color="gray.500">
              {getInitials(business.name)}
            </Text>
          )}
        </Box>
        <Box flex="1" minW={0}>
          <Text fontSize="sm" fontWeight={600} color="gray.900" noOfLines={1}>
            {business.name}
          </Text>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {[business.address, business.city].filter(Boolean).join(', ')}
          </Text>
        </Box>
      </HStack>

      <Divider my={3} />

      {step >= 2 && slot && (
        <>
          <Box fontSize="sm" color="gray.900">
            <HStack spacing={2} mb={1.5}>
              <Box color="gray.500">
                <CalendarIcon size={14} />
              </Box>
              <Text as="span">{formatDateLong(date)}</Text>
            </HStack>
            <HStack spacing={2}>
              <Box color="gray.500">
                <ClockIcon size={14} />
              </Box>
              <Text as="span">
                {slot} – {endTimeFromSlot(slot, service.durationMinutes)}
              </Text>
            </HStack>
          </Box>
          <Divider my={3} />
        </>
      )}

      <Flex justify="space-between" gap={3}>
        <Box minW={0}>
          <Text fontSize="sm" fontWeight={600} color="gray.900" noOfLines={1}>
            {service.name}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={0.5}>
            {formatDuration(service.durationMinutes)}
          </Text>
        </Box>
        <Text fontSize="sm" fontWeight={700} whiteSpace="nowrap" color="gray.900">
          {formatPrice(service)}
        </Text>
      </Flex>

      <Divider my={3} />

      <Flex justify="space-between">
        <Text fontSize="14px" fontWeight={700}>
          Total
        </Text>
        <Text fontSize="14px" fontWeight={700}>
          {formatPrice(service)}
        </Text>
      </Flex>
    </Box>
  );
}
