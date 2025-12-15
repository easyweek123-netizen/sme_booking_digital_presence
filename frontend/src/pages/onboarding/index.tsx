import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import {
  ConversationalOnboarding,
  type OnboardingData,
} from '../../components/ConversationalOnboarding';
import { useGetMyBusinessQuery, useCreateBusinessMutation } from '../../store/api/businessApi';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from '../../config/routes';

export function OnboardingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isCreating, setIsCreating] = useState(false);

  // Check if user already has a business
  const { data: existingBusiness, isLoading } = useGetMyBusinessQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [createBusiness] = useCreateBusinessMutation();

  // Redirect if user already has a business
  useEffect(() => {
    if (isAuthenticated && existingBusiness && !isLoading) {
      navigate(ROUTES.DASHBOARD.CHAT);
    }
  }, [isAuthenticated, existingBusiness, isLoading, navigate]);

  // Handle auth success - create business
  const handleAuthSuccess = async (data: OnboardingData) => {
    setIsCreating(true);
    try {
      await createBusiness({
        name: data.businessName,
      }).unwrap();

      navigate(ROUTES.DASHBOARD.CHAT, { state: { fromOnboarding: true } });
    } catch {
      toast({
        title: 'Failed to create business',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsCreating(false);
    }
  };

  return (
    <ConversationalOnboarding
      onAuth={handleAuthSuccess}
      isAuthLoading={isCreating}
    />
  );
}
