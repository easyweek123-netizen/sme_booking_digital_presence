import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { ArrowLeftIcon, CloseIcon } from '../../icons';
import type { BookingStep } from './bookingFlow.types';

interface WizardTopBarProps {
  steps: readonly BookingStep[];
  currentIndex: number;
  isDesktop: boolean;
  onBack: () => void;
  onClose: () => void;
  onCrumbClick: (idx: number) => void;
}

function getStepLabel(step: BookingStep) {
  if (step.id === 'service') return 'Services';
  if (step.id === 'time') return 'Date & Time';
  if (step.id === 'checkout') return 'Confirm';
  return step.title;
}

export function WizardTopBar({
  steps,
  currentIndex,
  isDesktop,
  onBack,
  onClose,
  onCrumbClick,
}: WizardTopBarProps) {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={20}
      bg="surface.card"
      borderBottom="1px solid"
      borderColor="surface.muted"
      px={{ base: 3, lg: 6 }}
      py={3}
    >
      <HStack justify="space-between" position="relative">
        <IconButton
          aria-label="Back"
          icon={<ArrowLeftIcon />}
          variant="ghost"
          onClick={onBack}
        />

        {isDesktop ? (
          <HStack
            spacing={6}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            {steps.map((step, idx) => {
              const active = idx === currentIndex;
              const done = idx < currentIndex;
              const clickable = done;
              return (
                <Box
                  as="button"
                  key={step.id}
                  onClick={() => clickable && onCrumbClick(idx)}
                  fontSize="sm"
                  fontWeight={active ? 600 : 500}
                  color={active ? 'text.heading' : 'text.muted'}
                  cursor={clickable || active ? 'pointer' : 'default'}
                  position="relative"
                  py={2}
                >
                  {getStepLabel(step)}
                  {active && (
                    <Box
                      position="absolute"
                      left={0}
                      right={0}
                      bottom={0}
                      h="2px"
                      bg="text.heading"
                      borderRadius="full"
                    />
                  )}
                </Box>
              );
            })}
          </HStack>
        ) : (
          <HStack
            spacing={1.5}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            {steps.map((step, idx) => {
              const active = idx === currentIndex;
              const done = idx < currentIndex;
              const clickable = done;
              return (
                <Box
                  as="button"
                  key={step.id}
                  onClick={() => clickable && onCrumbClick(idx)}
                  aria-label={getStepLabel(step)}
                  aria-current={active ? 'step' : undefined}
                  cursor={clickable ? 'pointer' : 'default'}
                  h="6px"
                  w={active ? '24px' : '6px'}
                  borderRadius="full"
                  bg={active || done ? 'text.heading' : 'border.subtle'}
                  transition="all .15s"
                />
              );
            })}
            <Text srOnly>
              Step {currentIndex + 1} of {steps.length}
            </Text>
          </HStack>
        )}

        <IconButton
          aria-label="Close"
          icon={<CloseIcon />}
          variant="ghost"
          onClick={onClose}
        />
      </HStack>
    </Box>
  );
}
