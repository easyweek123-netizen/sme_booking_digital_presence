import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { ConversationalOnboarding } from '../../components/ConversationalOnboarding';
import { useOnboardingFlow } from '../../components/ConversationalOnboarding/useOnboardingFlow';
import { useGetMyBusinessQuery, useCreateBusinessMutation, useGetBusinessCategoriesQuery } from '../../store/api/businessApi';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../config/routes';
import { TOAST_DURATION } from '../../constants';
export function OnboardingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch business categories for the type selection step
  const { data: businessCategories = [] } = useGetBusinessCategoriesQuery();

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
    businessTypeId,
  } = useOnboardingFlow(businessCategories);

  // Business API
  const { data: existingBusiness, isLoading: isCheckingBusiness } = useGetMyBusinessQuery(
    undefined,
    { skip: !isAuthenticated }
  );
  const [createBusiness, { isLoading: isCreating, isSuccess, isError }] = useCreateBusinessMutation();

  // Redirect if user already has a business
  useEffect(() => {
    if (isAuthenticated && existingBusiness && !isCheckingBusiness) {
      navigate(ROUTES.DASHBOARD.CANVAS);
    }
  }, [isAuthenticated, existingBusiness, isCheckingBusiness, navigate]);

  const handleAuthError = (error: any) => {
    toast({
      title: 'Authentication failed',
      description: error.message || 'Something went wrong. Please try again.',
      status: 'error',
      duration: TOAST_DURATION.LONG,
      isClosable: true,
    });
  }
  // Create business handler
  const handleCreateBusiness = async () => {
    if (!data.businessName || isCreating || isSuccess) return;
    try {
      await createBusiness({
        name: data.businessName,
        businessTypeId: businessTypeId ?? undefined,
      }).unwrap();
      navigate(ROUTES.DASHBOARD.CANVAS, { state: { fromOnboarding: true } });
    } catch(error) {
      handleAuthError(error);
    }
  };

  // Auto-create for authenticated users when onboarding completes
  // Wait for business check to complete and only create if no existing business
  useEffect(() => {
    if (
      isAuthenticated &&
      onboardingComplete &&
      data.businessName &&
      !isError &&
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
      isAuthenticated={isAuthenticated}
      isCreating={isCreating}
      isError={isError}
      handleAuthError={handleAuthError}
    />
  );
}
