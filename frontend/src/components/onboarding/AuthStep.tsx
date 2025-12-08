import { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCreateBusinessMutation } from '../../store/api/businessApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetOnboarding } from '../../store/slices/onboardingSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { TOAST_DURATION } from '../../constants';
import { GoogleButton } from '../../lib/auth';
import { type User } from '../../lib/firebase';

const MotionBox = motion.create(Box);

export function AuthStep() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { businessProfile, services } = useAppSelector((state) => state.onboarding);
  
  const [createBusiness, { isLoading: isCreatingBusiness }] = useCreateBusinessMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleAuthSuccess(_user: User) {
    setIsProcessing(true);
    
    try {
      // Create business after authentication
      if (businessProfile) {
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
      }

      // Clear onboarding and redirect
      dispatch(resetOnboarding());
      
      toast({
        title: 'Welcome to BookEasy!',
        description: 'Your business has been created successfully.',
        status: 'success',
        duration: TOAST_DURATION.LONG,
        isClosable: true,
      });

      navigate(ROUTES.DASHBOARD.ROOT);
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
  }

  function handleAuthError(error: Error) {
    toast({
      title: 'Authentication failed',
      description: error.message || 'Something went wrong. Please try again.',
      status: 'error',
      duration: TOAST_DURATION.LONG,
      isClosable: true,
    });
  }

  const isLoading = isCreatingBusiness || isProcessing;

  return (
    <MotionBox
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center" mb={2}>
          <Heading size="lg" color="gray.900" mb={2}>
            Create Your Account
          </Heading>
          <Text color="gray.600">
            You're almost done! Sign in with Google to save your business.
          </Text>
        </Box>

        {/* Auth Options */}
        <VStack
          spacing={5}
          bg="white"
          p={6}
          borderRadius="xl"
          border="1px"
          borderColor="gray.100"
        >
          <GoogleButton
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
            isDisabled={isLoading}
          />

          {isLoading && (
            <Text color="gray.500" fontSize="sm" textAlign="center">
              Creating your business...
            </Text>
          )}
        </VStack>
      </VStack>
    </MotionBox>
  );
}
