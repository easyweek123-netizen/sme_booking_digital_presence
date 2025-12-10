import {
  Box,
  HStack,
  Text,
  Button,
  Collapse,
  Input,
  InputGroup,
  InputLeftAddon,
  Flex,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ChevronRightIcon, SearchIcon, ClockIcon } from '../../../components/icons';
import { bookingsApi } from '../../../store/api/bookingsApi';
import { formatTime } from '../../../constants';
import { formatPrice, formatBookingDate } from '../../../utils/format';
import { BOOKING_STATUS_CONFIG } from '../../../constants';
import type { Booking } from '../../../types';

export function BookingStatusCheck() {
  const { isOpen, onToggle } = useDisclosure();
  const [referenceCode, setReferenceCode] = useState('');
  const [triggerGetBooking, { data: foundBooking, isLoading: isSearching, error: searchError }] =
    bookingsApi.useLazyGetBookingByReferenceQuery();

  const handleCheckStatus = () => {
    if (referenceCode.trim()) {
      const code = referenceCode.trim().toUpperCase();
      const fullReference = code.startsWith('BK-') ? code : `BK-${code}`;
      triggerGetBooking(fullReference);
    }
  };

  return (
    <Box>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<SearchIcon size={16} />}
        rightIcon={
          <Box
            transform={isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
            transition="transform 0.2s"
          >
            <ChevronRightIcon size={16} />
          </Box>
        }
        onClick={onToggle}
        color="gray.600"
        px={0}
        _hover={{ bg: 'transparent', color: 'gray.900' }}
      >
        Check Booking Status
      </Button>
      <Collapse in={isOpen}>
        <Box mt={2} p={4} bg="gray.50" borderRadius="lg">
          <HStack spacing={2} mb={3}>
            <InputGroup size="sm">
              <InputLeftAddon
                bg="white"
                borderColor="gray.200"
                color="gray.500"
                fontWeight="500"
                fontSize="xs"
              >
                BK-
              </InputLeftAddon>
              <Input
                placeholder="XXXX"
                value={referenceCode.replace('BK-', '')}
                onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                maxLength={4}
                bg="white"
                borderColor="gray.200"
                textTransform="uppercase"
                letterSpacing="wide"
                _focus={{ borderColor: 'brand.500' }}
              />
            </InputGroup>
            <Button
              size="sm"
              colorScheme="brand"
              onClick={handleCheckStatus}
              isLoading={isSearching}
              isDisabled={!referenceCode.trim()}
              px={6}
            >
              Check
            </Button>
          </HStack>

          {searchError && (
            <Box p={4} bg="red.50" borderRadius="lg" textAlign="center">
              <Text color="red.600" fontSize="sm">
                Booking not found. Please check your reference code.
              </Text>
            </Box>
          )}

          {foundBooking && <BookingStatusCard booking={foundBooking} />}
        </Box>
      </Collapse>
    </Box>
  );
}

interface BookingStatusCardProps {
  booking: Booking;
}

function BookingStatusCard({ booking }: BookingStatusCardProps) {
  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];

  const statusMessage = {
    PENDING: 'Your booking request is awaiting confirmation from the business.',
    CONFIRMED: 'Great news! Your booking is confirmed.',
    COMPLETED: 'This service has been completed. Thanks for visiting!',
    CANCELLED: 'This booking was cancelled.',
    NO_SHOW: 'This booking was marked as a no-show.',
  }[booking.status];

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      borderLeftWidth="4px"
      borderLeftColor={statusConfig.color}
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontSize="xs" color="gray.400" fontWeight="500">
          {booking.reference}
        </Text>
        <Badge
          bg={statusConfig.bg}
          color={statusConfig.color}
          fontSize="xs"
          px={2}
          py={0.5}
          borderRadius="full"
          fontWeight="600"
        >
          {statusConfig.label}
        </Badge>
      </Flex>

      {booking.service && (
        <Box mb={3}>
          <Text fontWeight="600" color="gray.900">
            {booking.service.name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {booking.service.durationMinutes} min · {formatPrice(Number(booking.service.price))}
          </Text>
        </Box>
      )}

      <HStack spacing={4} fontSize="sm" color="gray.600" mb={3}>
        <HStack spacing={1}>
          <ClockIcon size={14} />
          <Text>
            {formatBookingDate(booking.date)} · {formatTime(booking.startTime)}
          </Text>
        </HStack>
      </HStack>

      <Box
        p={3}
        bg={statusConfig.bg}
        borderRadius="md"
        fontSize="sm"
        color={statusConfig.color}
      >
        {statusMessage}
      </Box>
    </Box>
  );
}

