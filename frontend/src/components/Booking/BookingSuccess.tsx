import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Center,
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
              borderRadius="full"
              bg="green.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="green.500"
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
          <Text fontSize="2xl" fontWeight="700" color="gray.900" mb={1}>
            Booking Confirmed!
          </Text>
          <Text color="gray.500" fontSize="sm">
            A confirmation has been sent to {booking.customerEmail}
          </Text>
        </MotionBox>

        {/* Booking Details Card */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          w="full"
        >
          <Box
            bg="gray.50"
            borderRadius="xl"
            p={5}
            border="1px"
            borderColor="gray.100"
          >
            {/* Service Info */}
            <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
              {service.name}
            </Text>

            <VStack spacing={2} align="stretch">
              <HStack spacing={3}>
                <Box color="gray.400">
                  <CalendarIcon size={18} />
                </Box>
                <Text color="gray.700" fontSize="sm">
                  {formatFullDate(booking.date)}
                </Text>
              </HStack>

              <HStack spacing={3}>
                <Box color="gray.400">
                  <ClockIcon size={18} />
                </Box>
                <Text color="gray.700" fontSize="sm">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </Text>
              </HStack>

              <HStack spacing={3} justify="space-between">
                <HStack spacing={3}>
                  <Box color="gray.400" w="18px" />
                  <Text color="gray.500" fontSize="sm">
                    Total
                  </Text>
                </HStack>
                <Text fontWeight="600" color="gray.900">
                  {formatPrice(Number(service.price))}
                </Text>
              </HStack>
            </VStack>

            <Divider my={4} borderColor="gray.200" />

            {/* Business Info */}
            <VStack spacing={2} align="stretch">
              <Text fontWeight="600" color="gray.900" fontSize="sm">
                {business.name}
              </Text>
              {business.city && (
                <HStack spacing={2} color="gray.500" fontSize="sm">
                  <MapPinIcon size={14} />
                  <Text>{business.city}</Text>
                </HStack>
              )}
              {business.phone && (
                <HStack spacing={2} color="gray.500" fontSize="sm">
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
              borderRadius="xl"
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

