import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, IconButton, useToast } from '@chakra-ui/react';
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
import { setStep, resetOnboarding } from '../../store/slices/onboardingSlice';
import { useGetMyBusinessQuery, useCreateBusinessMutation } from '../../store/api/businessApi';
import { ROUTES } from '../../config/routes';
import { TOAST_DURATION } from '../../constants';

const MotionBox = motion.create(Box);

// Steps configuration
const STEPS_LOGGED_OUT = [
  { number: 1, label: 'Profile' },
  { number: 2, label: 'Services' },
  { number: 3, label: 'Account' },
];

const STEPS_LOGGED_IN = [
  { number: 1, label: 'Profile' },
  { number: 2, label: 'Services' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  
  const { currentStep, businessProfile, services } = useAppSelector(
    (state) => state.onboarding
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Create business mutation
  const [createBusiness, { isLoading: isCreatingBusiness }] = useCreateBusinessMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const hasNavigatedRef = useRef(false);
  
  // Check if user already has a business (only when authenticated)
  const { data: existingBusiness, isLoading: isCheckingBusiness } = useGetMyBusinessQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  // Dynamic steps based on auth state
  const steps = isAuthenticated ? STEPS_LOGGED_IN : STEPS_LOGGED_OUT;
  const totalSteps = steps.length;

  // Only redirect if user is authenticated AND already has a business
  // This allows authenticated users without a business to complete onboarding
  // Skip this redirect if we're currently creating a business (isProcessing)
  useEffect(() => {
    // Don't redirect if we've already navigated or are creating a business
    if (hasNavigatedRef.current || isProcessing) return;
    
    if (isAuthenticated && existingBusiness && !isCheckingBusiness) {
      navigate(ROUTES.DASHBOARD.ROOT);
    }
  }, [isAuthenticated, existingBusiness, isCheckingBusiness, isProcessing, navigate]);

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
        return false; // Last step for logged out users, no next
      default:
        return false;
    }
  }, [currentStep, businessProfile, services]);

  const canGoBack = currentStep > 1;
  const isLoading = isCreatingBusiness || isProcessing;

  const handleStepClick = (step: number) => {
    if (step <= totalSteps) {
      dispatch(setStep(step));
    }
  };

  // Create business for logged-in users
  const handleCreateBusiness = async () => {
    if (!businessProfile) return;
    
    setIsProcessing(true);
    
    try {
      await createBusiness({
        name: businessProfile.name,
        phone: businessProfile.phone || undefined,
        description: businessProfile.description || undefined,
        address: businessProfile.address || undefined,
        city: businessProfile.city || undefined,
        logoUrl: businessProfile.logoUrl || undefined,
        brandColor: businessProfile.brandColor || undefined,
        workingHours: businessProfile.workingHours,
        services: services.map((s) => ({
          name: s.name,
          durationMinutes: s.durationMinutes,
          price: s.price,
          availableDays: s.availableDays,
        })),
      }).unwrap();

      // Clear onboarding and redirect
      dispatch(resetOnboarding());
      
      // Mark that we've navigated to prevent duplicate redirect
      hasNavigatedRef.current = true;
      
      // Navigate with state to trigger welcome tour
      navigate(ROUTES.DASHBOARD.ROOT, { state: { fromOnboarding: true } });
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: 'Failed to create business',
        description: err.data?.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.LONG,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (!canProceed) return;

    // If logged in and on step 2, create business directly
    if (isAuthenticated && currentStep === 2) {
      handleCreateBusiness();
      return;
    }

    // Otherwise, go to next step
    if (currentStep < totalSteps) {
      dispatch(setStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isLoading) {
      dispatch(setStep(currentStep - 1));
    }
  };

  // Handle auth success from AuthStep (for logged out users)
  const handleAuthSuccess = () => {
    // User just authenticated, now create the business
    handleCreateBusiness();
  };

  // Handle auth error from AuthStep
  const handleAuthError = (error: Error) => {
    toast({
      title: 'Authentication failed',
      description: error.message || 'Something went wrong. Please try again.',
      status: 'error',
      duration: TOAST_DURATION.LONG,
      isClosable: true,
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileStep />;
      case 2:
        return <ServicesStep />;
      case 3:
        // Only show AuthStep for logged out users
        return !isAuthenticated ? (
          <AuthStep
            onAuthSuccess={handleAuthSuccess}
            onAuthError={handleAuthError}
            isCreating={isLoading}
          />
        ) : (
          <ServicesStep />
        );
      default:
        return <ProfileStep />;
    }
  };

  // Button text logic
  const getButtonText = () => {
    if (currentStep === 2) {
      return isAuthenticated ? 'Create My Page' : 'Continue to Account';
    }
    return 'Next';
  };

  // Show navigation buttons (hide on last step for logged out users - they have AuthStep button)
  const showNavButtons = isAuthenticated ? currentStep <= totalSteps : currentStep < totalSteps;

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
          steps={steps}
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
        {showNavButtons && (
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
                  isDisabled={isLoading}
                />
              )}
            </Box>
            <PrimaryButton
              onClick={handleNext}
              isDisabled={!canProceed || isLoading}
              isLoading={isLoading}
              loadingText="Creating..."
              size="lg"
              px={8}
              rightIcon={!isLoading ? <ChevronRightIcon size={20} /> : undefined}
              showArrow={false}
            >
              {getButtonText()}
            </PrimaryButton>
          </Flex>
        )}
      </Container>
    </Box>
  );
}
