import { Box, VStack, HStack, Text, Circle } from '@chakra-ui/react';
import { CheckIcon } from '../icons';

const STEPS = [
  { title: 'Add business name', description: 'Give your page a name' },
  { title: 'Select category', description: 'Help us personalize' },
  { title: 'Login & share', description: 'Go live instantly' },
];

// Sizing constants (Chakra spacing units: 1 unit = 4px)
const CIRCLE_SIZE = 14;        // 56px
const CONNECTOR_HEIGHT = 20;   // 80px
const ICON_SIZE = 24;          // For CheckIcon

interface OnboardingStepsProps {
  currentStep: number;
}

export function OnboardingSteps({ currentStep }: OnboardingStepsProps) {
  return (
    <Box
      w="full"
      h="full"
      bg="gray.900"
      color="white"
      p={8}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {/* Steps */}
      <VStack spacing={0} align="stretch" paddingRight={16}>
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <Box key={step.title}>
              <HStack spacing={4} align="flex-start">
                {/* Step indicator */}
                <VStack spacing={0}>
                  <Circle
                    size={CIRCLE_SIZE}
                    bg={isCompleted ? 'brand.500' : isCurrent ? 'white' : 'gray.700'}
                    color={isCompleted ? 'white' : isCurrent ? 'gray.900' : 'gray.500'}
                    fontWeight="600"
                    fontSize="lg"
                  >
                    {isCompleted ? (
                      <CheckIcon size={ICON_SIZE} />
                    ) : (
                      index + 1
                    )}
                  </Circle>

                  {/* Connector line */}
                  {index < STEPS.length - 1 && (
                    <Box
                      w={0.5}
                      h={CONNECTOR_HEIGHT}
                      bg={isCompleted ? 'brand.500' : 'gray.700'}
                    />
                  )}
                </VStack>

                {/* Step content */}
                <Box pt={3}>
                  <Text
                    fontWeight="600"
                    fontSize="lg"
                    color={isUpcoming ? 'gray.500' : 'white'}
                  >
                    {step.title}
                  </Text>
                  <Text
                    fontSize="md"
                    color={isUpcoming ? 'gray.600' : 'gray.400'}
                  >
                    {step.description}
                  </Text>
                </Box>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
