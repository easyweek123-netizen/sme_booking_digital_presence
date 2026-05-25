import type { ReactNode } from 'react';
import { Flex, IconButton, HStack, Box, Spinner, Text, VStack, Heading } from '@chakra-ui/react';
import { ArrowLeftIcon } from '../icons';
import { Logo } from '../ui/Logo';
import { ProgressBar } from './ProgressBar';

interface Props {
  activeStep: number;
  totalSteps: number;
  title: string;
  hint: string;
  onBack: () => void;
  actions?: ReactNode;
  isSubmitting?: boolean;
  errorMessage?: string;
  children: ReactNode;
}

export function OnboardingShell({
  activeStep, totalSteps, title, hint, onBack, actions, isSubmitting, errorMessage, children,
}: Props) {
  return (
    <Flex direction="column" minH="100vh" bg="#09090D" overflow="hidden">
      <ProgressBar activeStep={activeStep} totalSteps={totalSteps} />
      <HStack px={{ base: 6, md: 16 }} pt={4} pb={2} justify="space-between" align="center">
        {activeStep === 0 ? (
          <Logo size="md" colorScheme="dark" />
        ) : (
          <IconButton
            aria-label="Go back"
            icon={<ArrowLeftIcon />}
            onClick={onBack}
            variant="ghost"
            color="white"
            borderRadius="full"
            _hover={{ bg: 'whiteAlpha.200' }}
          />
        )}
        {actions}
      </HStack>
      <Box flex={1}>
        {isSubmitting ? (
          <HStack justify="center" spacing={3} py={20}>
            <Spinner size="md" color="brand.400" />
            <Text color="whiteAlpha.700" fontSize="sm">Creating your business…</Text>
          </HStack>
        ) : (
          <VStack
            spacing={5}
            align="stretch"
            maxW="md"
            mx="auto"
            px={{ base: 6, md: 0 }}
            pt={{ base: 12, md: 24 }}
          >
            <VStack spacing={2} textAlign="center">
              <Heading
                color="white"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="700"
                letterSpacing="-0.02em"
              >
                {title}
              </Heading>
              <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.6">
                {hint}
              </Text>
            </VStack>
            {children}
            {errorMessage && (
              <Text fontSize="xs" color="red.300" textAlign="center">
                {errorMessage}
              </Text>
            )}
          </VStack>
        )}
      </Box>
    </Flex>
  );
}
