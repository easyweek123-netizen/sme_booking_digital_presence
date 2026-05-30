import { HStack, Box } from '@chakra-ui/react';

interface Props { activeStep: number; totalSteps: number; }

export function ProgressBar({ activeStep, totalSteps }: Props) {
  return (
    <HStack spacing={1} px={{ base: 6, md: 16 }} pt={4} w="100%">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <Box
          key={i}
          flex={1}
          h="3px"
          borderRadius="full"
          bg={i <= activeStep ? 'accent.primary' : 'border.subtle'}
        />
      ))}
    </HStack>
  );
}
