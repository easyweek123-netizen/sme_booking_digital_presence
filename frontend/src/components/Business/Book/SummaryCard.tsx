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
import { businessAddressLine } from '../utils/locationLookup';

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
      bg="surface.card"
      border="1px solid"
      borderColor="border.subtle"
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
          bg="surface.muted"
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {business.logoUrl ? (
            <Image src={business.logoUrl} alt="" w="100%" h="100%" objectFit="cover" />
          ) : (
            <Text fontSize="14px" fontWeight={700} color="text.muted">
              {getInitials(business.name)}
            </Text>
          )}
        </Box>
        <Box flex="1" minW={0}>
          <Text fontSize="sm" fontWeight={600} color="text.heading" noOfLines={1}>
            {business.name}
          </Text>
          <Text fontSize="xs" color="text.muted" noOfLines={1}>
            {businessAddressLine(business)}
          </Text>
        </Box>
      </HStack>

      <Divider my={3} />

      {step >= 2 && slot && (
        <>
          <Box fontSize="sm" color="text.heading">
            <HStack spacing={2} mb={1.5}>
              <Box color="text.muted">
                <CalendarIcon size={14} />
              </Box>
              <Text as="span">{formatDateLong(date)}</Text>
            </HStack>
            <HStack spacing={2}>
              <Box color="text.muted">
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
          <Text fontSize="sm" fontWeight={600} color="text.heading" noOfLines={1}>
            {service.name}
          </Text>
          <Text fontSize="xs" color="text.muted" mt={0.5}>
            {formatDuration(service.durationMinutes)}
          </Text>
        </Box>
        <Text fontSize="sm" fontWeight={700} whiteSpace="nowrap" color="text.heading">
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
