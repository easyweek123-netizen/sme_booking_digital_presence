import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { ConversationalOnboarding } from '../../components/ConversationalOnboarding';
import { useOnboardingFlow } from '../../components/ConversationalOnboarding/useOnboardingFlow';
import {
  useGetMyBusinessQuery,
  useCreateBusinessMutation,
  useGetBusinessCategoriesQuery,
} from '../../store/api/businessApi';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../config/routes';
import { TOAST_DURATION } from '../../constants';

export function OnboardingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: businessCategories = [] } = useGetBusinessCategoriesQuery();

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

  const { data: existingBusiness, isLoading: isCheckingBusiness } = useGetMyBusinessQuery(
    undefined,
    { skip: !isAuthenticated },
  );
  const [createBusiness, { isLoading: isCreating, isSuccess, isError }] =
    useCreateBusinessMutation();

  useEffect(() => {
    if (isAuthenticated && existingBusiness && !isCheckingBusiness) {
      navigate(ROUTES.DASHBOARD.CANVAS);
    }
  }, [isAuthenticated, existingBusiness, isCheckingBusiness, navigate]);

  const handleAuthError = useCallback(
    (error: unknown) => {
      const description =
        error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      toast({
        title: 'Authentication failed',
        description,
        status: 'error',
        duration: TOAST_DURATION.LONG,
        isClosable: true,
      });
    },
    [toast],
  );

  const handleCreateBusiness = useCallback(async () => {
    if (!data.businessName || isCreating || isSuccess) return;
    try {
      await createBusiness({
        name: data.businessName,
        businessTypeId: businessTypeId ?? undefined,
      }).unwrap();
      navigate(ROUTES.DASHBOARD.CANVAS, { state: { fromOnboarding: true } });
    } catch (error) {
      handleAuthError(error);
    }
  }, [
    data.businessName,
    businessTypeId,
    createBusiness,
    handleAuthError,
    isCreating,
    isSuccess,
    navigate,
  ]);

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
  }, [
    isAuthenticated,
    onboardingComplete,
    data.businessName,
    isError,
    isCreating,
    isSuccess,
    isCheckingBusiness,
    existingBusiness,
    handleCreateBusiness,
  ]);

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
