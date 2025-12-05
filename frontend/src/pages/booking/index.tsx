import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Collapse,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGetBusinessBySlugQuery } from '../../store/api/businessApi';
import { ROUTES } from '../../config/routes';
import { bookingsApi } from '../../store/api/bookingsApi';
import { PhoneIcon, MapPinIcon, ClockIcon, ChevronRightIcon, SearchIcon } from '../../components/icons';
import { Logo } from '../../components/ui/Logo';
import { BookingDrawer } from '../../components/Booking/BookingDrawer';
import type { Service, Booking } from '../../types';
import { formatTime, DAY_LABELS, DAYS_OF_WEEK, BOOKING_STATUS_CONFIG } from '../../constants';
import { formatDuration, formatPrice, formatBookingDate } from '../../utils/format';

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: business, isLoading, error } = useGetBusinessBySlugQuery(slug || '');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { isOpen: isHoursOpen, onToggle: toggleHours } = useDisclosure();
  const { isOpen: isStatusOpen, onToggle: toggleStatus } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  // Status check state
  const [referenceCode, setReferenceCode] = useState('');
  const [triggerGetBooking, { data: foundBooking, isLoading: isSearching, error: searchError }] = 
    bookingsApi.useLazyGetBookingByReferenceQuery();

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    openDrawer();
  };

  const handleDrawerClose = () => {
    closeDrawer();
    setSelectedService(null);
  };

  const handleCheckStatus = () => {
    if (referenceCode.trim()) {
      // Add BK- prefix if not already present
      const code = referenceCode.trim().toUpperCase();
      const fullReference = code.startsWith('BK-') ? code : `BK-${code}`;
      triggerGetBooking(fullReference);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.500">Loading...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Error state
  if (error || !business) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="xl"
            py={8}
          >
            <AlertIcon boxSize="40px" mr={0} mb={4} />
            <Heading size="md" mb={2}>
              Business Not Found
            </Heading>
            <Text color="gray.600">
              The booking page you're looking for doesn't exist or has been removed.
            </Text>
          </Alert>
        </Container>
      </Box>
    );
  }

  const activeServices = business.services?.filter((s) => s.isActive) || [];

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.100" py={3}>
        <Container maxW="lg">
          <Logo size="sm" onClick={() => navigate(ROUTES.HOME)} />
        </Container>
      </Box>

      {/* Business Info */}
      <Box bg="white" pb={6} pt={8} borderBottom="1px" borderColor="gray.100">
        <Container maxW="lg">
          <VStack spacing={4} align="stretch">
            {/* Business Name & Description */}
            <Box>
              <Heading size="xl" color="gray.900" mb={2}>
                {business.name}
              </Heading>
              {business.description && (
                <Text color="gray.600" fontSize="md">
                  {business.description}
                </Text>
              )}
            </Box>

            {/* Contact Info */}
            <HStack spacing={4} flexWrap="wrap">
              {business.city && (
                <HStack spacing={1} color="gray.500" fontSize="sm">
                  <MapPinIcon size={16} />
                  <Text>{business.city}</Text>
                </HStack>
              )}
              {business.phone && (
                <HStack spacing={1} color="gray.500" fontSize="sm">
                  <PhoneIcon size={16} />
                  <Text>{business.phone}</Text>
                </HStack>
              )}
            </HStack>

            {/* Working Hours Toggle */}
            {business.workingHours && (
              <Box>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<ClockIcon size={16} />}
                  rightIcon={
                    <Box
                      transform={isHoursOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
                      transition="transform 0.2s"
                    >
                      <ChevronRightIcon size={16} />
                    </Box>
                  }
                  onClick={toggleHours}
                  color="gray.600"
                  px={0}
                  _hover={{ bg: 'transparent', color: 'gray.900' }}
                >
                  Working Hours
                </Button>
                <Collapse in={isHoursOpen}>
                  <VStack
                    align="stretch"
                    spacing={1}
                    mt={2}
                    p={4}
                    bg="gray.50"
                    borderRadius="lg"
                    fontSize="sm"
                  >
                    {DAYS_OF_WEEK.map((day) => {
                      const schedule = business.workingHours?.[day];
                      return (
                        <Flex key={day} justify="space-between">
                          <Text color="gray.600" fontWeight="500">
                            {DAY_LABELS[day]}
                          </Text>
                          <Text color={schedule?.isOpen ? 'gray.900' : 'gray.400'}>
                            {schedule?.isOpen
                              ? `${formatTime(schedule.openTime)} - ${formatTime(schedule.closeTime)}`
                              : 'Closed'}
                          </Text>
                        </Flex>
                      );
                    })}
                  </VStack>
                </Collapse>
              </Box>
            )}

            {/* Check Booking Status Toggle */}
            <Box>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<SearchIcon size={16} />}
                rightIcon={
                  <Box
                    transform={isStatusOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
                    transition="transform 0.2s"
                  >
                    <ChevronRightIcon size={16} />
                  </Box>
                }
                onClick={toggleStatus}
                color="gray.600"
                px={0}
                _hover={{ bg: 'transparent', color: 'gray.900' }}
              >
                Check Booking Status
              </Button>
              <Collapse in={isStatusOpen}>
                <Box mt={2} p={4} bg="gray.50" borderRadius="lg">
                  {/* Reference input */}
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

                  {/* Search result */}
                  {searchError && (
                    <Box
                      p={4}
                      bg="red.50"
                      borderRadius="lg"
                      textAlign="center"
                    >
                      <Text color="red.600" fontSize="sm">
                        Booking not found. Please check your reference code.
                      </Text>
                    </Box>
                  )}

                  {foundBooking && (
                    <BookingStatusCard booking={foundBooking} />
                  )}
                </Box>
              </Collapse>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Services List */}
      <Container maxW="lg" py={6}>
        <Heading size="md" color="gray.900" mb={4}>
          Select a Service
        </Heading>

        {activeServices.length === 0 ? (
          <Box
            bg="white"
            p={8}
            borderRadius="xl"
            textAlign="center"
            border="1px"
            borderColor="gray.100"
          >
            <Text color="gray.500">No services available at the moment.</Text>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {activeServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={() => handleBookService(service)}
              />
            ))}
          </VStack>
        )}
      </Container>

      {/* Booking Drawer */}
      {selectedService && business && (
        <BookingDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          service={selectedService}
          business={business}
        />
      )}
    </Box>
  );
}

// Service Card Component
interface ServiceCardProps {
  service: Service;
  onBook: () => void;
}

function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="xl"
      border="1px"
      borderColor="gray.100"
      _hover={{ borderColor: 'brand.200', boxShadow: 'sm' }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="flex-start" gap={4}>
        <Box flex={1}>
          <Text fontWeight="600" color="gray.900" fontSize="lg" mb={1}>
            {service.name}
          </Text>
          <Text color="gray.500" fontSize="sm">
            {formatDuration(service.durationMinutes)}
          </Text>
        </Box>
        <VStack spacing={2} align="flex-end">
          <Text fontWeight="600" color="gray.900" fontSize="lg">
            {formatPrice(Number(service.price))}
          </Text>
          <Button
            size="sm"
            colorScheme="brand"
            onClick={onBook}
            rightIcon={<ChevronRightIcon size={16} />}
          >
            Book Now
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
}

// Booking Status Card Component (for customer status lookup)
interface BookingStatusCardProps {
  booking: Booking;
}

function BookingStatusCard({ booking }: BookingStatusCardProps) {
  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];

  // Message based on status
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
      {/* Status Badge */}
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

      {/* Service Info */}
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

      {/* Date & Time */}
      <HStack spacing={4} fontSize="sm" color="gray.600" mb={3}>
        <HStack spacing={1}>
          <ClockIcon size={14} />
          <Text>
            {formatBookingDate(booking.date)} · {formatTime(booking.startTime)}
          </Text>
        </HStack>
      </HStack>

      {/* Status Message */}
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
