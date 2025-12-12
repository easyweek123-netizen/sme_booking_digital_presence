import {
  Box,
  VStack,
  Text,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GoogleButton } from '../../lib/auth';
import { type User } from '../../lib/firebase';

const MotionBox = motion.create(Box);

interface AuthStepProps {
  onAuthSuccess: (user: User) => void;
  onAuthError: (error: Error) => void;
  isCreating?: boolean;
}

export function AuthStep({ onAuthSuccess, onAuthError, isCreating }: AuthStepProps) {
  // Show loading state while creating business
  if (isCreating) {
    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <VStack spacing={6} py={12}>
          <Spinner
            size="xl"
            color="brand.500"
            thickness="4px"
            speed="0.8s"
          />
          <Text color="gray.600" fontSize="lg">
            Creating your booking page...
          </Text>
        </VStack>
      </MotionBox>
    );
  }

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
            onSuccess={onAuthSuccess}
            onError={onAuthError}
          />
        </VStack>
      </VStack>
    </MotionBox>
  );
}
