import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  Flex,
  Spinner,
  Center,
  Divider,
  Button,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateSelector } from './DateSelector';
import { TimeSlotGrid } from './TimeSlotGrid';
import { BookerVerification } from './BookerVerification';
import { BookingSuccess } from './BookingSuccess';
import { useGetAvailabilityQuery, useCreateBookingMutation } from '../../store/api/bookingsApi';
import type { Service, BusinessWithServices, Booking } from '../../types';
import { formatTime, TOAST_DURATION } from '../../constants';
import { formatDuration, formatPrice, formatDateDisplay, getTodayString } from '../../utils/format';
import { generateBrandColorCss, isValidHexColor } from '../../utils/brandColor';
import { type User } from '../../lib/firebase';

const MotionBox = motion.create(Box);

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  business: BusinessWithServices;
}

type BookingStep = 'select' | 'verify' | 'success';

interface VerifiedCustomer {
  firebaseUser: User;
  name: string;
}

export function BookingDrawer({ isOpen, onClose, service, business }: BookingDrawerProps) {
  const toast = useToast();
  const placement = useBreakpointValue<'bottom' | 'right'>({ base: 'bottom', md: 'right' }) || 'bottom';
  const isDesktop = placement === 'right';

  // Generate brand color CSS variables if business has custom color
  const brandColorStyles = useMemo(() => {
    if (business.brandColor && isValidHexColor(business.brandColor)) {
      return generateBrandColorCss(business.brandColor);
    }
    return {};
  }, [business.brandColor]);
  
  // State
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<BookingStep>('select');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [_verifiedCustomer, setVerifiedCustomer] = useState<VerifiedCustomer | null>(null);

  // API hooks
  const {
    data: availability,
    isLoading: isLoadingSlots,
    isFetching: isFetchingSlots,
  } = useGetAvailabilityQuery(
    {
      businessId: business.id,
      date: selectedDate,
      serviceId: service.id,
    },
    { skip: !isOpen }
  );

  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(getTodayString());
      setSelectedTime(null);
      setStep('select');
      setCreatedBooking(null);
      setVerifiedCustomer(null);
    }
  }, [isOpen]);

  // Reset time when date changes
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('verify');
  };

  const handleBackToSelect = () => {
    setStep('select');
    setVerifiedCustomer(null);
  };

  const handleVerified = async (firebaseUser: User, name: string) => {
    setVerifiedCustomer({ firebaseUser, name });
    
    // Proceed to create booking
    if (!selectedTime) return;

    try {
      // The Firebase token will be added automatically by baseApi
      
      const booking = await createBooking({
        businessId: business.id,
        serviceId: service.id,
        date: selectedDate,
        startTime: selectedTime,
        customerName: name,
        customerEmail: firebaseUser.email || '',
      }).unwrap();

      setCreatedBooking(booking);
      setStep('success');
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      toast({
        title: 'Booking Failed',
        description: apiError.data?.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.LONG,
        isClosable: true,
      });
    }
  };

  const handleVerificationError = (error: Error) => {
    toast({
      title: 'Verification Failed',
      description: error.message || 'Could not verify your identity. Please try again.',
      status: 'error',
      duration: TOAST_DURATION.LONG,
      isClosable: true,
    });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement={placement} size={isDesktop ? 'md' : 'full'}>
      <DrawerOverlay />
      <DrawerContent
        borderTopRadius={isDesktop ? 'none' : '2xl'}
        borderLeftRadius={isDesktop ? 'xl' : 'none'}
        maxH={isDesktop ? '100vh' : '90vh'}
        bg="white"
        style={brandColorStyles}
      >
        <DrawerCloseButton size="lg" top={4} right={4} />
        
        {/* Header - Service Info */}
        <DrawerHeader borderBottomWidth="1px" borderColor="gray.100" pb={4}>
          <VStack align="start" spacing={1}>
            <Text fontSize="xl" fontWeight="600" color="gray.900">
              {service.name}
            </Text>
            <HStack spacing={2} color="gray.500" fontSize="sm">
              <Text>{formatDuration(service.durationMinutes)}</Text>
              <Text>·</Text>
              <Text fontWeight="500" color="gray.700">
                {formatPrice(Number(service.price))}
              </Text>
            </HStack>
          </VStack>
        </DrawerHeader>

        <DrawerBody p={0} overflowY="auto">
          <AnimatePresence mode="wait">
            {step === 'success' && createdBooking ? (
              <MotionBox
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <BookingSuccess
                  booking={createdBooking}
                  service={service}
                  business={business}
                  onClose={onClose}
                  onBookAnother={() => {
                    setStep('select');
                    setSelectedTime(null);
                    setCreatedBooking(null);
                    setVerifiedCustomer(null);
                  }}
                />
              </MotionBox>
            ) : (
              <MotionBox
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VStack spacing={0} align="stretch">
                  {/* Date Selector - always visible */}
                  <Box p={4} bg="gray.50">
                    <DateSelector
                      selectedDate={selectedDate}
                      onDateChange={setSelectedDate}
                      workingHours={business.workingHours}
                    />
                  </Box>

                  <Divider />

                  {/* Content based on step */}
                  <Box p={4}>
                    {step === 'select' ? (
                      <>
                        {isLoadingSlots || isFetchingSlots ? (
                          <Center py={12}>
                            <VStack spacing={3}>
                              <Spinner size="lg" color="brand.500" />
                              <Text color="gray.500" fontSize="sm">
                                Loading available times...
                              </Text>
                            </VStack>
                          </Center>
                        ) : (
                          <TimeSlotGrid
                            slots={availability?.slots || []}
                            selectedTime={selectedTime}
                            onSelectTime={handleTimeSelect}
                          />
                        )}
                      </>
                    ) : step === 'verify' ? (
                      <MotionBox
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Selected Time Summary */}
                        <Flex
                          justify="space-between"
                          align="center"
                          mb={4}
                          p={3}
                          bg="brand.50"
                          borderRadius="lg"
                        >
                          <Text fontSize="sm" color="gray.700">
                            {formatDateDisplay(selectedDate)} at{' '}
                            <Text as="span" fontWeight="600" color="brand.600">
                              {selectedTime && formatTime(selectedTime)}
                            </Text>
                          </Text>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorScheme="brand"
                            onClick={handleBackToSelect}
                          >
                            Change
                          </Button>
                        </Flex>

                        {/* Verification Component */}
                        <BookerVerification
                          onVerified={handleVerified}
                          onError={handleVerificationError}
                          businessName={business.name}
                        />

                        {isCreating && (
                          <Center py={4}>
                            <VStack spacing={2}>
                              <Spinner size="md" color="brand.500" />
                              <Text fontSize="sm" color="gray.500">
                                Creating your booking...
                              </Text>
                            </VStack>
                          </Center>
                        )}
                      </MotionBox>
                    ) : null}
                  </Box>
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
