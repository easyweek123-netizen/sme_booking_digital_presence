import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { ConversationalOnboarding } from '../../components/ConversationalOnboarding';
import { useOnboardingFlow } from '../../components/ConversationalOnboarding/useOnboardingFlow';
import { useGetMyBusinessQuery, useCreateBusinessMutation } from '../../store/api/businessApi';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../config/routes';

export function OnboardingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Onboarding flow state
  const {
    messages,
    data,
    currentStep,
    onboardingComplete,
    isTyping,
    placeholder,
    handleSubmit,
    handleSuggestionSelect,
  } = useOnboardingFlow();

  // Business API
  const { data: existingBusiness, isLoading: isCheckingBusiness } = useGetMyBusinessQuery(
    undefined,
    { skip: !isAuthenticated }
  );
  const [createBusiness, { isLoading: isCreating, isSuccess }] = useCreateBusinessMutation();

  // Redirect if user already has a business
  useEffect(() => {
    if (isAuthenticated && existingBusiness && !isCheckingBusiness) {
      navigate(ROUTES.DASHBOARD.CHAT);
    }
  }, [isAuthenticated, existingBusiness, isCheckingBusiness, navigate]);

  // Create business handler
  const handleCreateBusiness = async () => {
    if (!data.businessName || isCreating || isSuccess) return;
    
    try {
      await createBusiness({ name: data.businessName }).unwrap();
      navigate(ROUTES.DASHBOARD.CHAT, { state: { fromOnboarding: true } });
    } catch {
      toast({
        title: 'Failed to create practice',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Auto-create for authenticated users when onboarding completes
  // Wait for business check to complete and only create if no existing business
  useEffect(() => {
    if (
      isAuthenticated &&
      onboardingComplete &&
      data.businessName &&
      !isCreating &&
      !isSuccess &&
      !isCheckingBusiness &&
      !existingBusiness
    ) {
      handleCreateBusiness();
    }
  }, [isAuthenticated, onboardingComplete, data.businessName, isCreating, isSuccess, isCheckingBusiness, existingBusiness]);

  return (
    <ConversationalOnboarding
      messages={messages}
      currentStep={currentStep}
      onboardingComplete={onboardingComplete}
      isTyping={isTyping}
      placeholder={placeholder}
      onSubmit={handleSubmit}
      onSuggestionSelect={handleSuggestionSelect}
      onCreateBusiness={handleCreateBusiness}
      isAuthenticated={isAuthenticated}
      isCreating={isCreating}
    />
  );
}
