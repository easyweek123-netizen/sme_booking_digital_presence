import { useState, useEffect } from 'react';
import {
  Flex,
  Box,
  VStack,
  HStack,
  Spinner,
  Text,
  SimpleGrid,
  Circle,
  Heading,
  Input,
  Button,
  Checkbox,
  Link,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { GoogleButton } from '../../lib/auth';
import { Logo } from '../ui/Logo';
import { ROUTES } from '../../config/routes';
import type { Message } from '../../types/chat.types';
import type { Step, BusinessData } from './onboardingReducer';

interface ConversationalOnboardingProps {
  // State from hook
  messages: Message[];
  currentStep: Step | undefined;
  onboardingComplete: boolean;
  isTyping: boolean;
  placeholder?: string;
  data: BusinessData;
  // Handlers
  onSubmit: (value: string) => void;
  onSuggestionSelect: (value: string, label: string) => void;
  onBack: () => void;
  // Auth state
  isAuthenticated: boolean;
  isCreating: boolean;
  isError: boolean;
  handleAuthError: (error: unknown) => void;
}

export function ConversationalOnboarding({
  messages,
  currentStep,
  onboardingComplete,
  isTyping,
  data,
  onSubmit,
  onSuggestionSelect,
  onBack,
  isAuthenticated,
  isCreating,
  isError,
  handleAuthError,
}: ConversationalOnboardingProps) {
  const navigate = useNavigate();

  // Local states to handle custom forms and smooth input mapping
  const [localName, setLocalName] = useState('');
  const [localWebsite, setLocalWebsite] = useState(''); // Authentic mock website field from user's screen
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [selectedTypeLabel, setSelectedTypeLabel] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Synchronize local states with redux/hook data (vital when going back between steps)
  useEffect(() => {
    setLocalName(data.businessName || '');
  }, [data.businessName]);

  useEffect(() => {
    setSelectedTypeId(data.businessTypeId ? String(data.businessTypeId) : '');
  }, [data.businessTypeId]);

  // Stepper structure configuration
  const totalSteps = 3;
  const activeStep = onboardingComplete ? 3 : (currentStep?.id === 'type' ? 2 : 1);

  // Find the last bot message which contains the dynamically loaded suggestions
  const lastBotMessage = messages.slice().reverse().find((m) => m.role === 'bot');

  // Filter out any "Skip" or blank suggestions to render them cleanly as selection cards
  const categoriesList = lastBotMessage?.suggestions?.filter((s) => s.value !== '') || [];

  const handleStep1Submit = () => {
    const trimmed = localName.trim();
    if (!trimmed || isTyping) return;
    onSubmit(trimmed);
  };

  const handleStep2Submit = () => {
    if (!selectedTypeId || isTyping) return;
    onSuggestionSelect(selectedTypeId, selectedTypeLabel);
  };

  return (
    <Flex minH="100vh" bg="#09090D" direction="column" overflow="hidden" position="relative">

      {/* 1. HORIZONTAL PROGRESS STEPPER BAR (Sleek horizontal bars at the very top) */}
      <HStack spacing={2.5} w="full" px={{ base: 6, md: 16 }} pt={5} pb={2} flexShrink={0}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isCompletedOrActive = activeStep >= stepNum;
          return (
            <Box
              key={i}
              flex={1}
              h="3px"
              borderRadius="full"
              bg={isCompletedOrActive ? 'brand.500' : '#1C1B22'}
              transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            />
          );
        })}
      </HStack>

      {/* 2. TOP ACTION HEADER (Back button / Logo left, "Continue" or "Skip" pill on the right) */}
      <Flex
        align="center"
        justify="space-between"
        w="full"
        px={{ base: 6, md: 16 }}
        py={5}
        flexShrink={0}
        borderBottom="1px solid"
        borderColor="#121217"
      >
        {activeStep > 1 ? (
          <Circle
            size="40px"
            bg="#18171F"
            border="1px solid"
            borderColor="gray.850"
            color="white"
            cursor="pointer"
            onClick={onBack}
            _hover={{ bg: '#23222B', borderColor: 'gray.700' }}
            _active={{ bg: '#2E2D37' }}
            transition="all 0.2s"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Circle>
        ) : (
          <Logo size="md" colorScheme="dark" onClick={() => navigate(ROUTES.HOME)} />
        )}

        {/* Step 1 CTA button */}
        {activeStep === 1 && (
          <Button
            onClick={handleStep1Submit}
            isDisabled={localName.trim().length === 0 || isTyping}
            bg="white"
            color="black"
            borderRadius="full"
            px={7}
            h="44px"
            fontSize="sm"
            fontWeight="600"
            _hover={{ bg: 'gray.200' }}
            _active={{ bg: 'gray.300' }}
            transition="all 0.2s"
            rightIcon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '4px' }}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            }
          >
            Continue
          </Button>
        )}

        {/* Step 2 CTA buttons (Skip + Continue) */}
        {activeStep === 2 && (
          <HStack spacing={4}>
            <Button
              variant="ghost"
              color="gray.400"
              onClick={() => onSuggestionSelect('', 'Skip')}
              _hover={{ color: 'white', bg: 'transparent' }}
              fontSize="sm"
              fontWeight="500"
            >
              Skip
            </Button>
            <Button
              onClick={handleStep2Submit}
              isDisabled={!selectedTypeId || isTyping}
              bg="white"
              color="black"
              borderRadius="full"
              px={7}
              h="44px"
              fontSize="sm"
              fontWeight="600"
              _hover={{ bg: 'gray.200' }}
              _active={{ bg: 'gray.300' }}
              transition="all 0.2s"
              rightIcon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '4px' }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              }
            >
              Continue
            </Button>
          </HStack>
        )}
      </Flex>

      {/* 3. CENTRAL STEPPER FORM LAYOUT */}
      <Flex flex={1} align="flex-start" justify="center" px={6} pt={{ base: 8, md: 16 }} pb={8} overflowY="auto">
        <Box maxW={activeStep === 2 ? { base: 'xl', md: '75%' } : 'xl'} w="full">

          {/* STEP 1: BUSINESS NAME SETUP */}
          {activeStep === 1 && (
            <VStack spacing={8} align="stretch">
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" mb={2.5}>
                  Account setup
                </Text>
                <Heading fontSize={{ base: '2xl', md: '3xl' }} color="white" fontWeight="600" letterSpacing="-0.02em" mb={3}>
                  What's your business name?
                </Heading>
                <Text fontSize="sm" color="gray.400" lineHeight="relaxed">
                  This is the brand name your clients will see. Your website and legal details can be added later.
                </Text>
              </Box>

              <VStack spacing={5} align="stretch" pt={2}>
                <Box>
                  <Text fontSize="xs" color="gray.400" fontWeight="600" mb={2}>
                    Business name
                  </Text>
                  <Input
                    placeholder="e.g. Mindful Studio"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && localName.trim() && handleStep1Submit()}
                    size="lg"
                    bg="#18171F"
                    border="1px solid"
                    borderColor="gray.800"
                    color="white"
                    h="54px"
                    borderRadius="md"
                    fontSize="sm"
                    _placeholder={{ color: 'gray.600' }}
                    _hover={{ borderColor: 'gray.700' }}
                    _focus={{ borderColor: 'white', boxShadow: '0 0 0 1px white' }}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.400" fontWeight="600" mb={2}>
                    Website (Optional)
                  </Text>
                  <Input
                    placeholder="www.yoursite.com"
                    value={localWebsite}
                    onChange={(e) => setLocalWebsite(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && localName.trim() && handleStep1Submit()}
                    size="lg"
                    bg="#18171F"
                    border="1px solid"
                    borderColor="gray.800"
                    color="white"
                    h="54px"
                    borderRadius="md"
                    fontSize="sm"
                    _placeholder={{ color: 'gray.600' }}
                    _hover={{ borderColor: 'gray.700' }}
                    _focus={{ borderColor: 'white', boxShadow: '0 0 0 1px white' }}
                  />
                </Box>
              </VStack>
            </VStack>
          )}

          {/* STEP 2: BUSINESS CATEGORY SELECTION */}
          {activeStep === 2 && (
            <VStack spacing={8} align="stretch">
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" mb={2.5}>
                  Business profile
                </Text>
                <Heading fontSize={{ base: '2xl', md: '3xl' }} color="white" fontWeight="600" letterSpacing="-0.02em" mb={3}>
                  What type of business is it?
                </Heading>
                <Text fontSize="sm" color="gray.400" lineHeight="relaxed">
                  Select the category that best describes your practice to help clients find you.
                </Text>
              </Box>

              <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={3.5} pt={2}>
                {categoriesList.map((category) => {
                  const isSelected = selectedTypeId === category.value;

                  // Helper to render matching line-art icons
                  const getCategoryIcon = (label: string) => {
                    switch (label) {
                      case 'Hair salon':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M7 21v-4a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v4" />
                            <path d="M12 12v-2a4 4 0 0 0-8 0v2" />
                          </svg>
                        );
                      case 'Nails':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2C9.5 2 8 4.5 8 7v10c0 2.2 1.8 4 4 4s4-1.8 4-4V7c0-2.5-1.5-5-4-5z" />
                            <path d="M8 12h8" />
                          </svg>
                        );
                      case 'Eyebrows & lashes':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 5V2" /><path d="M16 6l2-2" /><path d="M8 6L6 4" />
                          </svg>
                        );
                      case 'Beauty salon':
                      case 'Waxing salon':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="7" y="7" width="10" height="15" rx="2" />
                            <path d="M10 2h4v5h-4z" />
                            <path d="M12 2v-2" />
                          </svg>
                        );
                      case 'Medspa':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
                          </svg>
                        );
                      case 'Barber':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 10h12v4H6z" />
                            <path d="M8 14v6M16 14v6M4 20h16" />
                            <path d="M12 10V4" />
                          </svg>
                        );
                      case 'Massage':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="10" width="20" height="4" rx="1" />
                            <path d="M5 14v6M19 14v6" />
                            <circle cx="7" cy="7" r="2" />
                          </svg>
                        );
                      case 'Spa & sauna':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 8h16v12H4z" />
                            <path d="M4 12h16" />
                          </svg>
                        );
                      case 'Tattooing & piercing':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            <path d="M3 3l18 18" />
                          </svg>
                        );
                      case 'Tanning studio':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6M10 14c0-3.31 2.69-6 6-6s6 2.69 6 6" />
                            <path d="M2 14h20" />
                          </svg>
                        );
                      case 'Fitness & recovery':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="5" cy="18" r="4" />
                            <circle cx="19" cy="18" r="4" />
                            <path d="M5 18l4-9 4.5 4L19 18" />
                            <path d="M9 9h4" />
                          </svg>
                        );
                      case 'Physical therapy':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14.5 4.5l-5 5L7 12l-2 5h4l2-5 2.5-2.5 5 2.5v-4l-4-3z" />
                          </svg>
                        );
                      case 'Health practice':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2v20M2 12h20" />
                          </svg>
                        );
                      case 'Pet grooming':
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 5c-3.5 0-6 2.5-6 6v3h12v-3c0-3.5-2.5-6-6-6z" />
                            <path d="M6 11L4 7l3 1" />
                            <path d="M18 11l2-4-3 1" />
                            <circle cx="9" cy="11" r="1" />
                            <circle cx="15" cy="11" r="1" />
                          </svg>
                        );
                      case 'Other':
                      default:
                        return (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                        );
                    }
                  };

                  return (
                    <Flex
                      key={category.value}
                      onClick={() => {
                        setSelectedTypeId(category.value);
                        setSelectedTypeLabel(category.label);
                      }}
                      direction="column"
                      justify="space-between"
                      align="flex-start"
                      p={4}
                      bg="#151518"
                      border="1px solid"
                      borderColor={isSelected ? 'brand.500' : '#29282D'}
                      borderRadius="xl"
                      cursor="pointer"
                      minH="100px"
                      _hover={{ borderColor: isSelected ? 'brand.500' : 'gray.600' }}
                      transition="all 0.2s"
                    >
                      <Box color={isSelected ? 'brand.500' : 'white'} mb={5}>
                        {getCategoryIcon(category.label)}
                      </Box>
                      <Text color={isSelected ? 'brand.500' : 'white'} fontSize="sm" fontWeight="600">
                        {category.label}
                      </Text>
                    </Flex>
                  );
                })}
              </SimpleGrid>
            </VStack>
          )}

          {/* STEP 3: ACCOUNT CREATION / SECURE LOGIN */}
          {activeStep === 3 && (
            <VStack spacing={8} align="stretch" textAlign="center">
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" mb={2.5}>
                  Security & Access
                </Text>
                <Heading fontSize={{ base: '2xl', md: '3xl' }} color="white" fontWeight="600" letterSpacing="-0.02em" mb={3}>
                  Create your free account
                </Heading>
                <Text fontSize="sm" color="gray.400" lineHeight="relaxed" maxW="sm" mx="auto">
                  Sign in securely using Google to finalize setting up your BookEasy portal.
                </Text>
              </Box>

              <Box pt={4} maxW="sm" mx="auto" w="full">
                {isAuthenticated && !isError ? (
                  <HStack justify="center" spacing={3} py={4}>
                    <Spinner size="sm" color="brand.500" />
                    <Text color="gray.400" fontSize="sm" fontWeight="500">
                      Creating your practice...
                    </Text>
                  </HStack>
                ) : (
                  <VStack spacing={4}>
                    <Checkbox
                      colorScheme="brand"
                      size="md"
                      isChecked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      borderColor="gray.600"
                      alignItems="flex-start"
                      textAlign="left"
                    >
                      <Text fontSize="xs" color="gray.400" lineHeight="1.4" mt="-2px">
                        I agree to the{' '}
                        <Link color="brand.300" _hover={{ color: 'brand.200' }} onClick={() => navigate(ROUTES.TERMS)}>Terms of Service</Link>
                        {' '}and{' '}
                        <Link color="brand.300" _hover={{ color: 'brand.200' }} onClick={() => navigate(ROUTES.PRIVACY)}>Privacy Policy</Link>
                      </Text>
                    </Checkbox>

                    <GoogleButton
                      onError={handleAuthError}
                      onSuccess={() => { }}
                      isDisabled={isCreating || !termsAccepted}
                      h="54px"
                      bg="white"
                      color="black"
                      border="none"
                      borderRadius="full"
                      fontWeight="600"
                      _hover={{ bg: 'gray.200' }}
                      _active={{ bg: 'gray.300' }}
                    />
                    {isError && (
                      <Text fontSize="xs" color="red.400" mt={2}>
                        Creating account failed. Please try again.
                      </Text>
                    )}
                  </VStack>
                )}
              </Box>
            </VStack>
          )}

        </Box>
      </Flex>

    </Flex>
  );
}
