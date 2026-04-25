import { Box, VStack, HStack, Text, Button, Divider } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CalendarIcon, UserIcon, ShieldIcon } from '../../../../components/icons';
import { formatDuration, formatPrice, formatDateDisplay } from '../../../../utils/format';
import { formatTime } from '../../../../constants';
import type { BusinessWithServices, Service } from '../../../../types';

const MotionBox = motion.create(Box);

const DEFAULT_CANCELLATION_COPY =
  'Cancel or reschedule up to 12 hours before your appointment — no charge.';

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

function continueLabel(step: 1 | 2 | 3 | 4): string {
  if (step === 1) return 'Continue to date & time  →';
  if (step === 2) return 'Continue to your details  →';
  if (step === 3) return 'Confirm booking  →';
  return 'Done';
}

const rowMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

export function BookingSummarySidebar(p: Props) {
  const showEmptyGuidance = p.step === 1 && !p.selectedService;
  const showService = !!p.selectedService;
  const showDateTime = !!p.selectedService && !!p.selectedTime;
  const showDetails = !!(p.customerName || p.customerEmail);
  const showTotal = !!p.selectedService;
  const showContinueCta =
    p.step < 4 && p.step !== 3 && !(p.step === 1 && !p.selectedService);

  return (
    <VStack
      align="stretch"
      spacing={4}
      position="sticky"
      sx={{
        top: 'calc(var(--booking-header-h, 80px) + 16px)',
      }}
    >
      <Box bg="surface.card" border="1px solid" borderColor="border.subtle" borderRadius="xl" p={5}>
        <Text fontSize="xs" fontWeight="700" letterSpacing="wider" color="text.muted" mb={4}>
          YOUR BOOKING
        </Text>

        {showEmptyGuidance && (
          <Text fontSize="sm" color="text.muted" lineHeight="short">
            Select a service to start
          </Text>
        )}

        {showService && (
          <MotionBox {...rowMotion}>
            <VStack align="stretch" spacing={1}>
              <HStack justify="space-between" align="start">
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="text.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Service
                </Text>
                <Text fontSize="sm" fontWeight="600" color="text.heading">
                  {formatPrice(Number(p.selectedService!.price))}
                </Text>
              </HStack>
              <Text fontSize="md" fontWeight="600" color="text.heading">
                {p.selectedService!.name}
              </Text>
              <Text fontSize="sm" color="text.muted">
                {formatDuration(p.selectedService!.durationMinutes)}
              </Text>
            </VStack>
          </MotionBox>
        )}

        {showService && showDateTime && (
          <>
            <Divider my={4} />
            <MotionBox {...rowMotion}>
              <VStack align="stretch" spacing={1}>
                <HStack justify="space-between">
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="text.muted"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Date & time
                  </Text>
                  <Box color="text.muted">
                    <CalendarIcon size={16} />
                  </Box>
                </HStack>
                <Text fontSize="md" fontWeight="600" color="text.heading">
                  {formatDateDisplay(p.selectedDate)} · {formatTime(p.selectedTime!)}
                </Text>
              </VStack>
            </MotionBox>
          </>
        )}

        {showService && showDetails && (
          <>
            <Divider my={4} />
            <MotionBox {...rowMotion}>
              <VStack align="stretch" spacing={1}>
                <HStack justify="space-between">
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="text.muted"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Your details
                  </Text>
                  <Box color="text.muted">
                    <UserIcon size={16} />
                  </Box>
                </HStack>
                {p.customerName && (
                  <Text fontSize="md" fontWeight="600" color="text.heading">
                    {p.customerName}
                  </Text>
                )}
                {p.customerEmail && (
                  <Text fontSize="sm" color="text.muted">
                    {p.customerEmail}
                  </Text>
                )}
              </VStack>
            </MotionBox>
          </>
        )}

        {showTotal && (
          <>
            <Divider my={4} />
            <MotionBox {...rowMotion}>
              <HStack justify="space-between" mb={showContinueCta ? 5 : 0}>
                <Text fontSize="md" fontWeight="600" color="text.heading">
                  Total
                </Text>
                <Text fontSize="xl" fontWeight="700" color="text.heading">
                  {formatPrice(Number(p.selectedService!.price))}
                </Text>
              </HStack>
            </MotionBox>
          </>
        )}

        {showContinueCta && (
          <Button
            w="100%"
            h={12}
            mt={!showTotal ? 4 : 0}
            bg="gray.800"
            color="white"
            borderRadius="xl"
            fontWeight="600"
            _hover={{ bg: 'gray.700' }}
            onClick={p.onContinue}
            isDisabled={!p.canContinue}
          >
            {continueLabel(p.step)}
          </Button>
        )}
      </Box>
    </VStack>
  );
}
