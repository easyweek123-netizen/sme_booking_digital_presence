import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useTour } from '../../contexts/TourContext';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../icons';
import { MotionBox } from '../ui/MotionBox';
import { TOUR_Z_INDEX, TOUR_DIMENSIONS, TOUR_ANIMATION } from '../../config/tourConstants';

interface TooltipPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export function TourTooltip() {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    targetElement,
    nextStep,
    prevStep,
    skipTour,
  } = useTour();

  const [position, setPosition] = useState<TooltipPosition>({});

  // Calculate tooltip position based on target element and placement
  useEffect(() => {
    if (!targetElement || !currentStep) {
      setPosition({});
      return;
    }

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const { tooltipWidth, tooltipGap, padding } = TOUR_DIMENSIONS;
      const tooltipHeight = 180;

      let newPosition: TooltipPosition = {};

      switch (currentStep.placement) {
        case 'bottom':
          newPosition = {
            top: `${rect.bottom + tooltipGap + padding}px`,
            left: `${Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16))}px`,
          };
          break;
        case 'top':
          newPosition = {
            bottom: `${window.innerHeight - rect.top + tooltipGap + padding}px`,
            left: `${Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16))}px`,
          };
          break;
        case 'right':
          newPosition = {
            top: `${Math.max(16, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - 16))}px`,
            left: `${rect.right + tooltipGap + padding}px`,
          };
          break;
        case 'left':
          newPosition = {
            top: `${Math.max(16, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - 16))}px`,
            right: `${window.innerWidth - rect.left + tooltipGap + padding}px`,
          };
          break;
      }

      setPosition(newPosition);
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [targetElement, currentStep]);

  // Only show tooltip when we have a target element
  if (!isActive || !currentStep || !targetElement) return null;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <AnimatePresence mode="wait">
      <MotionBox
        key={currentStep.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: TOUR_ANIMATION.duration }}
        position="fixed"
        {...position}
        w={`${TOUR_DIMENSIONS.tooltipWidth}px`}
        bg="white"
        borderRadius="16px"
        boxShadow="0 4px 6px -1px rgba(0,0,0,0.1), 0 10px 20px -5px rgba(0,0,0,0.1)"
        zIndex={TOUR_Z_INDEX.tooltip}
        overflow="hidden"
      >
        {/* Close button */}
        <IconButton
          aria-label="Skip tour"
          icon={<CloseIcon size={10} />}
          size="xs"
          variant="ghost"
          position="absolute"
          top={3}
          right={3}
          onClick={skipTour}
          color="gray.400"
          bg="gray.50"
          borderRadius="full"
          minW="24px"
          h="24px"
          _hover={{ color: 'gray.600', bg: 'gray.100' }}
        />

        <VStack spacing={3} p={5} align="stretch">
          {/* Title */}
          <Heading size="sm" color="gray.800" pr={6} fontWeight="600">
            {currentStep.title}
          </Heading>

          {/* Message */}
          <Text fontSize="sm" color="gray.600" lineHeight="1.6">
            {currentStep.message}
          </Text>

          {/* Footer: Progress + Navigation */}
          <HStack justify="space-between" pt={1}>
            {/* Step indicator */}
            <HStack spacing={1.5}>
              {Array.from({ length: totalSteps }).map((_, index) => (
                <Box
                  key={index}
                  w={index === currentStepIndex ? '16px' : '6px'}
                  h="6px"
                  borderRadius="full"
                  bg={index <= currentStepIndex ? 'brand.500' : 'gray.200'}
                  transition="all 0.2s"
                />
              ))}
            </HStack>

            {/* Navigation buttons */}
            <HStack spacing={2}>
              {!isFirstStep && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<ChevronLeftIcon size={16} />}
                  onClick={prevStep}
                  color="gray.500"
                  _hover={{ color: 'gray.700' }}
                >
                  Back
                </Button>
              )}

              <Button
                size="sm"
                colorScheme="brand"
                rightIcon={!isLastStep ? <ChevronRightIcon size={16} /> : undefined}
                onClick={nextStep}
              >
                {isLastStep ? 'Done' : 'Next'}
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </MotionBox>
    </AnimatePresence>
  );
}
