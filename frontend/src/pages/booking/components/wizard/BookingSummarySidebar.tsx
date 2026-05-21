import { Box, VStack, HStack, Text, Button, Divider, Heading, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CalendarIcon, UserIcon } from '../../../../components/icons';
import { formatDuration, formatPrice, formatDateDisplay } from '../../../../utils/format';
import { formatTime } from '../../../../constants';
import type { BusinessWithServices, Service } from '../../../../types';

const MotionBox = motion.create(Box);

interface Props {
  business: BusinessWithServices;
  step: 1 | 2 | 3 | 4;
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string | null;
  customerName: string;
  customerEmail: string;
  canContinue: boolean;
  onContinue: () => void;
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function continueLabel(step: 1 | 2 | 3 | 4): string {
  if (step === 1) return 'Book now';
  if (step === 2) return 'Continue';
  return 'Confirm booking';
}

const rowMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

export function BookingSummarySidebar(p: Props) {
  const showService = !!p.selectedService;
  const showDateTime = !!p.selectedService && !!p.selectedTime;
  const showDetails = !!(p.customerName || p.customerEmail);

  return (
    <VStack
      align="stretch"
      spacing={4}
      position="sticky"
      sx={{
        top: 'calc(var(--booking-header-h, 80px) + 20px)',
      }}
    >
      <Box
        bg="white"
        border="1px solid"
        borderColor="#ECECEC"
        borderRadius="3xl"
        p={6}
        boxShadow="0 4px 24px rgba(0,0,0,0.015)"
      >
        {/* 1. BUSINESS PROFILE INFORMATION */}
        <Heading
          fontSize="xl"
          fontWeight="800"
          color="black"
          mb={2.5}
          lineHeight="short"
          letterSpacing="-0.02em"
        >
          {p.business.name}
        </Heading>

        {/* Rating Row */}
        <HStack spacing={1.5} align="center" mb={3.5}>
          <Text fontSize="sm" fontWeight="800" color="black">
            4.9
          </Text>
          <HStack spacing={0.5}>
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
          </HStack>
          <Text fontSize="xs" fontWeight="700" color="blue.500">
            (219)
          </Text>
        </HStack>

        {/* Badges Row */}
        <HStack spacing={2} mb={5.5}>
          <Box bg="#F3EEFC" color="#6B46C1" px={3} py={1} borderRadius="full" fontSize="10px" fontWeight="700">
            Featured
          </Box>
          <Box bg="#E8F8F0" color="#10B981" px={3} py={1} borderRadius="full" fontSize="10px" fontWeight="700">
            Deals
          </Box>
        </HStack>

        {/* 2. MAIN PILL CTA BUTTON */}
        <Button
          w="100%"
          h="52px"
          bg="black"
          color="white"
          borderRadius="full"
          fontWeight="700"
          fontSize="sm"
          onClick={p.onContinue}
          isDisabled={p.step !== 1 && !p.canContinue}
          _hover={{
            bg: 'gray.850',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
          _active={{
            bg: 'black',
            transform: 'scale(0.98)',
          }}
          _disabled={{
            bg: '#F3F3F5',
            color: 'gray.400',
            cursor: 'not-allowed',
          }}
          transition="all 0.15s ease"
          mb={5}
        >
          {continueLabel(p.step)}
        </Button>

        {/* 3. DYNAMIC SELECTED SERVICES SUMMARY DETAILS */}
        {showService && (
          <Box borderTop="1px solid" borderColor="#F1F1F4" pt={4.5} pb={1}>
            <Text
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.1em"
              color="gray.450"
              textTransform="uppercase"
              mb={4}
            >
              Your booking
            </Text>

            <MotionBox {...rowMotion}>
              <VStack align="stretch" spacing={1.5}>
                <HStack justify="space-between" align="start">
                  <Text fontSize="sm" fontWeight="700" color="black" noOfLines={1}>
                    {p.selectedService!.name}
                  </Text>
                  <Text fontSize="sm" fontWeight="800" color="black">
                    {formatPrice(Number(p.selectedService!.price))}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.400" fontWeight="600">
                  {formatDuration(p.selectedService!.durationMinutes)}
                </Text>
              </VStack>
            </MotionBox>

            {showDateTime && (
              <>
                <Divider my={4} borderColor="#F1F1F4" />
                <MotionBox {...rowMotion}>
                  <VStack align="stretch" spacing={1.5}>
                    <HStack justify="space-between">
                      <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.05em">
                        Date & time
                      </Text>
                      <Box color="gray.400">
                        <CalendarIcon size={14} />
                      </Box>
                    </HStack>
                    <Text fontSize="sm" fontWeight="700" color="black">
                      {formatDateDisplay(p.selectedDate)} · {formatTime(p.selectedTime!)}
                    </Text>
                  </VStack>
                </MotionBox>
              </>
            )}

            {showDetails && (
              <>
                <Divider my={4} borderColor="#F1F1F4" />
                <MotionBox {...rowMotion}>
                  <VStack align="stretch" spacing={1.5}>
                    <HStack justify="space-between">
                      <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.05em">
                        Your details
                      </Text>
                      <Box color="gray.400">
                        <UserIcon size={14} />
                      </Box>
                    </HStack>
                    {p.customerName && (
                      <Text fontSize="sm" fontWeight="700" color="black">
                        {p.customerName}
                      </Text>
                    )}
                    {p.customerEmail && (
                      <Text fontSize="xs" color="gray.400" fontWeight="600">
                        {p.customerEmail}
                      </Text>
                    )}
                  </VStack>
                </MotionBox>
              </>
            )}

            <Divider my={4} borderColor="#F1F1F4" />
            <MotionBox {...rowMotion} mb={2}>
              <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="700" color="black">
                  Total
                </Text>
                <Text fontSize="lg" fontWeight="800" color="black" letterSpacing="-0.02em">
                  {formatPrice(Number(p.selectedService!.price))}
                </Text>
              </HStack>
            </MotionBox>
          </Box>
        )}

        {/* 4. ADDRESS, WORKING HOURS, & PROMOTIONS PANEL */}
        <Box borderTop="1px solid" borderColor="#F1F1F4" pt={5}>
          
          {/* Status Open */}
          <HStack spacing={3} mb={4} align="center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <Text fontSize="xs" color="gray.600" fontWeight="600">
              <Text as="span" color="green.500" fontWeight="700">Open</Text> until 7:00 PM
            </Text>
          </HStack>

          {/* Location & Navigation */}
          <HStack spacing={3} align="start" mb={4.5}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <VStack align="flex-start" spacing={0.5} w="100%">
              <Text fontSize="xs" color="gray.600" fontWeight="600" lineHeight="short">
                {p.business.address || 'Avenida de la Osa Mayor 50, Moncloa - Aravaca, Madrid'}
              </Text>
              <Link fontSize="xs" fontWeight="700" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Get directions
              </Link>
            </VStack>
          </HStack>


        </Box>

      </Box>
    </VStack>
  );
}
