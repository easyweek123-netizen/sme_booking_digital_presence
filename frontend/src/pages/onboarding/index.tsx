import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, IconButton } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../../components/ui/Logo';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ChevronLeftIcon, ChevronRightIcon } from '../../components/icons';
import {
  OnboardingStepper,
  ProfileStep,
  ServicesStep,
  AuthStep,
} from '../../components/onboarding';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setStep } from '../../store/slices/onboardingSlice';
import { ROUTES } from '../../config/routes';

const MotionBox = motion.create(Box);

// Steps configuration
const STEPS = [
  { number: 1, label: 'Profile' },
  { number: 2, label: 'Services' },
  { number: 3, label: 'Account' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentStep, businessProfile, services } = useAppSelector(
    (state) => state.onboarding
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD.ROOT);
    }
  }, [isAuthenticated, navigate]);

  // Calculate completed steps based on data
  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    
    // Step 1 is complete if business name is provided
    if (businessProfile?.name?.trim()) {
      completed.push(1);
    }
    
    // Step 2 is complete if at least one service is added
    if (services.length > 0) {
      completed.push(2);
    }
    
    return completed;
  }, [businessProfile, services]);

  // Check if current step is valid to proceed
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!businessProfile?.name?.trim();
      case 2:
        return services.length > 0;
      case 3:
        return false; // Last step, no next
      default:
        return false;
    }
  }, [currentStep, businessProfile, services]);

  const canGoBack = currentStep > 1;

  const handleStepClick = (step: number) => {
    dispatch(setStep(step));
  };

  const handleNext = () => {
    if (currentStep < 3 && canProceed) {
      dispatch(setStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      dispatch(setStep(currentStep - 1));
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileStep />;
      case 2:
        return <ServicesStep />;
      case 3:
        return <AuthStep />;
      default:
        return <ProfileStep />;
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box
        position="sticky"
        top={0}
        bg="white"
        borderBottom="1px"
        borderColor="gray.100"
        zIndex={10}
      >
        <Container maxW="container.lg">
          <Flex h="64px" align="center" justify="center">
            <Logo size="md" onClick={() => navigate(ROUTES.HOME)} />
          </Flex>
        </Container>
      </Box>

      {/* Main content */}
      <Container maxW="container.md" py={{ base: 6, md: 10 }}>
        {/* Stepper */}
        <OnboardingStepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          completedSteps={completedSteps}
        />

        {/* Step content */}
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="sm"
          p={{ base: 5, md: 8 }}
          mb={6}
        >
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderCurrentStep()}
            </MotionBox>
          </AnimatePresence>
        </Box>

        {/* Navigation buttons */}
        {currentStep < 3 && (
          <Flex justify="space-between" align="center">
            <Box>
              {canGoBack && (
                <IconButton
                  aria-label="Go back"
                  icon={<ChevronLeftIcon size={24} />}
                  variant="ghost"
                  size="lg"
                  onClick={handleBack}
                  borderRadius="full"
                />
              )}
            </Box>
            <PrimaryButton
              onClick={handleNext}
              isDisabled={!canProceed}
              size="lg"
              px={8}
              rightIcon={<ChevronRightIcon size={20} />}
              showArrow={false}
            >
              {currentStep === 2 ? 'Continue to Account' : 'Next'}
            </PrimaryButton>
          </Flex>
        )}
      </Container>
    </Box>
  );
}
