import { Box, Flex, Text, VStack, HStack, IconButton, SimpleGrid, Heading, Button, Divider, GridItem } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { BusinessWithServices, Service, ServiceCategory } from '../../../../types';
import type { BookingWizardState } from './useBookingWizard';
import { formatDuration, formatPrice } from '../../../../utils/format';
import { DateTimeStep } from './DateTimeStep';

interface Props {
  business: BusinessWithServices;
  wizard: BookingWizardState;
  onBack: () => void;
  onClose: () => void;
  onContinueToAuth?: () => void;
}

// Chevron/Back Arrow Icon SVG
function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

// Close/X Icon SVG
function CloseXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

// Star rating icon
function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// List bullets menu icon
function BulletListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  );
}

// Plus sign icon
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

// Check mark icon
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

export function FullScreenWizardOverlay({ business, wizard, onBack, onClose, onContinueToAuth }: Props) {
  const activeServices = (business.services || []).filter((s) => s.isActive);

  // Safely extract categories matching ServiceStep logic
  const categories = useMemo<ServiceCategory[]>(() => {
    const map = new Map<number, ServiceCategory>();
    for (const s of activeServices) {
      if (s.category) {
        map.set(s.category.id, s.category);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [activeServices]);

  const activeCategoryId = wizard.selectedCategoryId;
  const filteredServices = useMemo(() => {
    return activeCategoryId == null
      ? activeServices
      : activeServices.filter((s) => s.categoryId === activeCategoryId);
  }, [activeServices, activeCategoryId]);

  const selectedService = wizard.selectedService;

  const handleCardClick = (service: Service) => {
    if (selectedService?.id === service.id) {
      wizard.handleSelectService(null as any);
    } else {
      wizard.handleSelectService(service);
    }
  };

  const handleContinue = () => {
    if (wizard.step === 1 && selectedService) {
      wizard.handleContinue();
    } else if (wizard.step === 2 && wizard.selectedTime && onContinueToAuth) {
      onContinueToAuth();
    }
  };

  const handleBackClick = () => {
    if (wizard.step === 2) {
      wizard.setStep(1);
    } else {
      onBack();
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="#F9F9FB"
      zIndex={9999}
      overflowY="auto"
      px={{ base: 4, md: 8 }}
      py={6}
    >
      {/* 1. TOP NAV CONTROL BAR */}
      <Flex justify="space-between" align="center" maxW="1320px" mx="auto" mb={6}>
        <IconButton
          aria-label="Go back"
          icon={<ArrowLeftIcon />}
          onClick={handleBackClick}
          variant="solid"
          bg="white"
          color="black"
          boxShadow="0 2px 8px rgba(0,0,0,0.04)"
          borderRadius="full"
          w="44px"
          h="44px"
          _hover={{ bg: 'gray.50' }}
          _active={{ transform: 'scale(0.96)' }}
        />
        <IconButton
          aria-label="Close booking"
          icon={<CloseXIcon />}
          onClick={onClose}
          variant="solid"
          bg="white"
          color="black"
          boxShadow="0 2px 8px rgba(0,0,0,0.04)"
          borderRadius="full"
          w="44px"
          h="44px"
          _hover={{ bg: 'gray.50' }}
          _active={{ transform: 'scale(0.96)' }}
        />
      </Flex>

      {/* 2. SUB-WIZARD BREADCRUMBS PROGRESS */}
      <Box maxW="1320px" mx="auto" mb={8} px={4}>
        <HStack spacing={2} fontSize="xs" fontWeight="700" color="gray.400">
          <Text color={wizard.step === 1 ? 'black' : 'gray.400'}>Services</Text>
          <Text>&gt;</Text>
          <Text color={wizard.step === 2 ? 'black' : 'gray.400'}>Date & Time</Text>
          <Text>&gt;</Text>
          <Text>Details</Text>
          <Text>&gt;</Text>
          <Text>Confirm</Text>
        </HStack>
      </Box>

      {/* 3. MAIN INTERACTION PANEL */}
      <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8} maxW="1320px" mx="auto" px={4} alignItems="start">
        
        {/* Left Column (Services Catalog OR Date/Time) */}
        <GridItem colSpan={{ base: 12, lg: 8 }} as={VStack} align="stretch" spacing={6}>
          {wizard.step === 1 && (
            <>
              <Heading fontSize="3xl" fontWeight="800" color="black" letterSpacing="-0.02em">
                Select services
              </Heading>

          {/* Category Chips Scrollbar */}
          <HStack spacing={2.5} overflowX="auto" pb={2} className="no-scrollbar" w="100%">
            <Button
              onClick={() => wizard.setSelectedCategoryId(null)}
              variant="solid"
              bg={!activeCategoryId ? 'black' : 'white'}
              color={!activeCategoryId ? 'white' : 'black'}
              borderRadius="full"
              px={5}
              h="38px"
              fontSize="xs"
              fontWeight="700"
              border="1px solid"
              borderColor={!activeCategoryId ? 'black' : '#ECECEC'}
              _hover={{ bg: !activeCategoryId ? 'black' : 'gray.50' }}
            >
              Featured
            </Button>
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <Button
                  key={cat.id}
                  onClick={() => wizard.setSelectedCategoryId(cat.id)}
                  variant="solid"
                  bg={isActive ? 'black' : 'white'}
                  color={isActive ? 'white' : 'black'}
                  borderRadius="full"
                  px={5}
                  h="38px"
                  fontSize="xs"
                  fontWeight="700"
                  border="1px solid"
                  borderColor={isActive ? 'black' : '#ECECEC'}
                  _hover={{ bg: isActive ? 'black' : 'gray.50' }}
                >
                  {cat.name}
                </Button>
              );
            })}
            <IconButton
              aria-label="View index"
              icon={<BulletListIcon />}
              variant="outline"
              borderColor="#ECECEC"
              bg="white"
              color="black"
              borderRadius="full"
              w="38px"
              h="38px"
            />
          </HStack>

          {/* Category Title Above List */}
          <Heading fontSize="lg" fontWeight="800" color="black" pt={2}>
            {!activeCategoryId ? 'Featured' : categories.find(c => c.id === activeCategoryId)?.name || ''}
          </Heading>

          {/* Service Cards Stack */}
          <VStack spacing={4} align="stretch">
            {filteredServices.map((service) => {
              const isSelected = selectedService?.id === service.id;
              // Mock discount calculation to render premium 'Save 24%' badges like screenshot
              const isPromo = service.name.toLowerCase().includes('brillo') || service.name.toLowerCase().includes('facial');
              const discountText = isPromo ? 'Save 24%' : '';
              
              return (
                <Box
                  key={service.id}
                  as="div"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(service)}
                  w="100%"
                  textAlign="left"
                  bg="white"
                  p={6}
                  borderRadius="2xl"
                  border="2px solid"
                  borderColor={isSelected ? '#6B46C1' : '#ECECEC'}
                  boxShadow="0 4px 12px rgba(0,0,0,0.01)"
                  transition="all 0.2s ease"
                  _hover={{
                    borderColor: isSelected ? '#6B46C1' : 'black',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.03)',
                  }}
                  position="relative"
                >
                  <VStack align="flex-start" spacing={1.5}>
                    {/* Name & Duration */}
                    <Text fontSize="md" fontWeight="800" color="black">
                      {service.name}
                    </Text>
                    <Text fontSize="xs" color="gray.400" fontWeight="600">
                      {formatDuration(service.durationMinutes)}
                    </Text>

                    {/* Description */}
                    <Text fontSize="xs" color="gray.500" lineHeight="relaxed" pr={12} pt={1}>
                      {service.description || 'Ofrecemos nuestro servicio esencial premium personalizado según tus preferencias con un trato distinguido y exclusivo.'}
                    </Text>

                    {/* Price and Action Circle Trigger */}
                    <Flex justify="space-between" align="center" w="100%" pt={3.5}>
                      <HStack spacing={2.5}>
                        <Text fontSize="sm" fontWeight="800" color="black">
                          {formatPrice(Number(service.price))}
                        </Text>
                        {discountText && (
                          <Text fontSize="10px" fontWeight="800" color="#10B981" bg="#E8F8F0" px={2} py={0.5} borderRadius="full">
                            {discountText}
                          </Text>
                        )}
                      </HStack>

                      {/* Icon Indicator Trigger */}
                      <Flex
                        align="center"
                        justify="center"
                        w="32px"
                        h="32px"
                        borderRadius="full"
                        border="2px solid"
                        borderColor={isSelected ? '#6B46C1' : '#E2E8F0'}
                        bg={isSelected ? '#6B46C1' : 'transparent'}
                        transition="all 0.15s ease"
                      >
                        {isSelected ? <CheckIcon /> : <PlusIcon />}
                      </Flex>
                    </Flex>
                  </VStack>
                </Box>
              );
            })}
              </VStack>
            </>
          )}

          {wizard.step === 2 && selectedService && (
            <DateTimeStep
              business={business}
              service={selectedService}
              selectedDate={wizard.selectedDate}
              onDateChange={wizard.handleDateChange}
              selectedTime={wizard.selectedTime}
              onSelectTime={wizard.handleSelectTime}
            />
          )}
        </GridItem>

        {/* Right Column (Luxurious Checkout Sidebar Card) */}
        <GridItem colSpan={{ base: 12, lg: 4 }} position="sticky" top="40px">
          <Box bg="white" border="1px solid" borderColor="#ECECEC" borderRadius="3xl" p={6} boxShadow="0 4px 20px rgba(0,0,0,0.01)">
            
            {/* Salon details Section */}
            <Flex gap={4.5} align="center" mb={5.5}>
              <Box
                w="64px"
                h="64px"
                borderRadius="2xl"
                bgImage="url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80')"
                bgSize="cover"
                bgPosition="center"
                flexShrink={0}
                border="1px solid"
                borderColor="gray.100"
              />
              <VStack align="flex-start" spacing={0.5} overflow="hidden">
                <Text fontSize="xs" fontWeight="800" color="black" noOfLines={1} lineHeight="tight">
                  {business.name}
                </Text>
                <HStack spacing={1}>
                  <Text fontSize="10px" fontWeight="800" color="black">4.9</Text>
                  <StarIcon />
                  <Text fontSize="9px" fontWeight="700" color="gray.400">(219)</Text>
                </HStack>
                <Text fontSize="9px" color="gray.400" fontWeight="600" noOfLines={1}>
                  {business.address || 'Moncloa - Aravaca, Madrid'}
                </Text>
              </VStack>
            </Flex>

            {/* Selected Service Row detail */}
            {selectedService ? (
              <Box borderTop="1px solid" borderColor="#F1F1F4" pt={4.5}>
                <VStack align="stretch" spacing={1.5} mb={5}>
                  <Flex justify="space-between" align="start">
                    <Text fontSize="xs" fontWeight="800" color="black" maxW="70%" noOfLines={2}>
                      {selectedService.name}
                    </Text>
                    <VStack align="flex-end" spacing={0}>
                      <Text fontSize="xs" fontWeight="800" color="black">
                        {formatPrice(Number(selectedService.price))}
                      </Text>
                      {/* Old Price Strikethrough for premium look */}
                      <Text fontSize="10px" color="gray.400" fontWeight="600" textDecoration="line-through">
                        {formatPrice(Number(selectedService.price) * 1.3)}
                      </Text>
                    </VStack>
                  </Flex>
                  <Text fontSize="10px" color="gray.400" fontWeight="600">
                    {formatDuration(selectedService.durationMinutes)} with any professional
                  </Text>
                  {wizard.step === 2 && wizard.selectedDate && (
                    <Text fontSize="10px" color="black" fontWeight="700" mt={1}>
                      {new Date(wizard.selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      {wizard.selectedTime ? ` at ${wizard.selectedTime}` : ''}
                    </Text>
                  )}
                </VStack>

                <Divider my={4.5} borderColor="#F1F1F4" />

                {/* Total Row */}
                <Flex justify="space-between" align="center" mb={6}>
                  <Text fontSize="xs" fontWeight="800" color="black">
                    Total
                  </Text>
                  <Text fontSize="md" fontWeight="800" color="black">
                    {formatPrice(Number(selectedService.price))}
                  </Text>
                </Flex>
              </Box>
            ) : (
              <Box borderTop="1px solid" borderColor="#F1F1F4" pt={4.5} pb={2.5}>
                <Text fontSize="xs" color="gray.400" fontWeight="600" textAlign="center" py={4}>
                  Choose a service to continue
                </Text>
              </Box>
            )}

            {/* Continue CTA pill button */}
            <Button
              w="100%"
              h="48px"
              bg="black"
              color="white"
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              onClick={handleContinue}
              isDisabled={wizard.step === 1 ? !selectedService : !wizard.selectedTime}
              _hover={{ bg: 'gray.850' }}
              _active={{ transform: 'scale(0.97)' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              Continue →
            </Button>

          </Box>
        </GridItem>

      </SimpleGrid>

    </Box>
  );
}
