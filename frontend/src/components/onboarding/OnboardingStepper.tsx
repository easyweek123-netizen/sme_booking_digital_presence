import { Box, Flex, Text, Circle, HStack, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckIcon } from '../icons';

const MotionBox = motion.create(Box);
const MotionCircle = motion.create(Circle);

interface Step {
  number: number;
  label: string;
}

interface OnboardingStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps?: number[];
}

export function OnboardingStepper({
  steps,
  currentStep,
  onStepClick,
  completedSteps = [],
}: OnboardingStepperProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isCompleted = (stepNumber: number) => completedSteps.includes(stepNumber);
  const isCurrent = (stepNumber: number) => currentStep === stepNumber;
  const isClickable = (stepNumber: number) => stepNumber <= Math.max(...completedSteps, currentStep);

  if (isMobile) {
    return (
      <Box w="full" mb={6}>
        {/* Mobile: Progress bar with step indicator */}
        <Flex align="center" justify="space-between" mb={2}>
          <Text fontSize="sm" fontWeight="500" color="gray.600">
            Step {currentStep} of {steps.length}
          </Text>
          <Text fontSize="sm" fontWeight="600" color="brand.500">
            {steps[currentStep - 1]?.label}
          </Text>
        </Flex>
        <Box bg="gray.100" h="2" borderRadius="full" overflow="hidden">
          <MotionBox
            bg="brand.500"
            h="full"
            borderRadius="full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </Box>
        {/* Mobile step dots */}
        <HStack justify="center" mt={3} spacing={2}>
          {steps.map((step) => (
            <Circle
              key={step.number}
              size="8px"
              bg={isCurrent(step.number) ? 'brand.500' : isCompleted(step.number) ? 'brand.300' : 'gray.200'}
              cursor={isClickable(step.number) ? 'pointer' : 'default'}
              onClick={() => isClickable(step.number) && onStepClick(step.number)}
              transition="all 0.2s"
              _hover={isClickable(step.number) ? { transform: 'scale(1.2)' } : {}}
            />
          ))}
        </HStack>
      </Box>
    );
  }

  return (
    <Flex justify="center" align="center" w="full" mb={8}>
      {steps.map((step, index) => (
        <Flex key={step.number} align="center">
          {/* Step circle */}
          <Flex
            direction="column"
            align="center"
            cursor={isClickable(step.number) ? 'pointer' : 'default'}
            onClick={() => isClickable(step.number) && onStepClick(step.number)}
            role="button"
            tabIndex={isClickable(step.number) ? 0 : -1}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && isClickable(step.number)) {
                onStepClick(step.number);
              }
            }}
            _focus={{ outline: 'none' }}
          >
            <MotionCircle
              size="40px"
              bg={isCurrent(step.number) ? 'brand.500' : isCompleted(step.number) ? 'brand.500' : 'gray.100'}
              color={isCurrent(step.number) || isCompleted(step.number) ? 'white' : 'gray.400'}
              fontWeight="600"
              fontSize="sm"
              initial={{ scale: 0.8 }}
              animate={{ scale: isCurrent(step.number) ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
              _hover={
                isClickable(step.number)
                  ? {
                      bg: isCurrent(step.number) || isCompleted(step.number) ? 'brand.600' : 'gray.200',
                      transform: 'scale(1.05)',
                    }
                  : {}
              }
            >
              {isCompleted(step.number) ? <CheckIcon size={16} /> : step.number}
            </MotionCircle>
            <Text
              mt={2}
              fontSize="sm"
              fontWeight={isCurrent(step.number) ? '600' : '400'}
              color={isCurrent(step.number) ? 'brand.500' : isCompleted(step.number) ? 'gray.700' : 'gray.400'}
              transition="all 0.2s"
            >
              {step.label}
            </Text>
          </Flex>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <Box
              w={{ base: '40px', md: '80px', lg: '120px' }}
              h="2px"
              mx={2}
              bg={isCompleted(step.number) ? 'brand.500' : 'gray.200'}
              position="relative"
              top="-12px"
              transition="background 0.3s"
            />
          )}
        </Flex>
      ))}
    </Flex>
  );
}

