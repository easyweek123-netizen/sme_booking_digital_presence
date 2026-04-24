import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Center,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CalendarIcon, ClockIcon, MapPinIcon, PhoneIcon } from '../icons';
import type { Booking, Service, BusinessWithServices } from '../../types';
import { formatTime } from '../../constants/booking';
import { formatFullDate, formatPrice } from '../../utils/format';

const MotionBox = motion.create(Box);

interface BookingSuccessProps {
  booking: Booking;
  service: Service;
  business: BusinessWithServices;
  onClose: () => void;
  onBookAnother: () => void;
}

export function BookingSuccess({
  booking,
  service,
  business,
  onClose,
  onBookAnother,
}: BookingSuccessProps) {
  return (
    <Box p={6}>
      <VStack spacing={6}>
        {/* Success Icon */}
        <Center>
          <MotionBox
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }}
          >
            <Box
              w="80px"
              h="80px"
              borderRadius="sm"
              bg="brand.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="accent.primary"
            >
              <CheckCircleIcon size={48} />
            </Box>
          </MotionBox>
        </Center>

        {/* Success Message */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          textAlign="center"
        >
          <Text fontSize="2xl" fontWeight="700" color="text.heading" mb={1}>
            Request Sent!
          </Text>
          <Text color="text.muted" fontSize="sm" mb={2}>
            Awaiting confirmation from {business.name}
          </Text>
          <Badge colorScheme="brand" fontSize="sm" px={3} py={1} borderRadius="lg">
            Reference: {booking.reference}
          </Badge>
        </MotionBox>

        {/* Booking Details Card */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          w="full"
        >
          <Box
            bg="surface.alt"
            borderRadius="sm"
            p={5}
            border="1px"
            borderColor="border.subtle"
          >
            {/* Service Info */}
            <Text fontSize="lg" fontWeight="600" color="text.heading" mb={3}>
              {service.name}
            </Text>

            <VStack spacing={2} align="stretch">
              <HStack spacing={3}>
                <Box color="text.faint">
                  <CalendarIcon size={18} />
                </Box>
                <Text color="text.strong" fontSize="sm">
                  {formatFullDate(booking.date)}
                </Text>
              </HStack>

              <HStack spacing={3}>
                <Box color="text.faint">
                  <ClockIcon size={18} />
                </Box>
                <Text color="text.strong" fontSize="sm">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </Text>
              </HStack>

              <HStack spacing={3} justify="space-between">
                <HStack spacing={3}>
                  <Box color="text.faint" w="18px" />
                  <Text color="text.muted" fontSize="sm">
                    Total
                  </Text>
                </HStack>
                <Text fontWeight="600" color="text.heading">
                  {formatPrice(Number(service.price))}
                </Text>
              </HStack>
            </VStack>

            <Divider my={4} borderColor="border.subtle" />

            {/* Business Info */}
            <VStack spacing={2} align="stretch">
              <Text fontWeight="600" color="text.heading" fontSize="sm">
                {business.name}
              </Text>
              {business.city && (
                <HStack spacing={2} color="text.muted" fontSize="sm">
                  <MapPinIcon size={14} />
                  <Text>{business.city}</Text>
                </HStack>
              )}
              {business.phone && (
                <HStack spacing={2} color="text.muted" fontSize="sm">
                  <PhoneIcon size={14} />
                  <Text>{business.phone}</Text>
                </HStack>
              )}
            </VStack>
          </Box>
        </MotionBox>

        {/* Action Buttons */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          w="full"
        >
          <VStack spacing={3} w="full">
            <Button
              colorScheme="brand"
              size="lg"
              w="full"
              h="56px"
              borderRadius="sm"
              onClick={onClose}
            >
              Done
            </Button>
            <Button
              variant="ghost"
              colorScheme="gray"
              size="md"
              onClick={onBookAnother}
            >
              Book another service
            </Button>
          </VStack>
        </MotionBox>
      </VStack>
    </Box>
  );
}

