import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  useToast,
  Link,
  Checkbox,
} from '@chakra-ui/react';
import { Logo } from '../../components/ui/Logo';
import { GoogleButton } from '../../lib/auth';
import { useAuth } from '../../contexts/useAuth';
import { type User } from '../../lib/firebase';
import { ROUTES } from '../../config/routes';
import { TOAST_DURATION } from '../../constants';

// Clean SVG Icons for Facebook and Apple to perfectly match the Fresha social authentication buttons
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" style={{ marginRight: '8px' }}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.73-1.2 1.87-1.05 2.98 1.11.09 2.27-.58 2.99-1.42Z" />
  </svg>
);

const WorldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { firebaseUser, isLoading } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Get the intended destination (if redirected from protected route)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.DASHBOARD.ROOT;

  // Redirect if already logged in
  useEffect(() => {
    if (firebaseUser && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [firebaseUser, isLoading, navigate, from]);

  function handleAuthSuccess(user: User) {
    toast({
      title: 'Welcome!',
      description: `Signed in as ${user.email || user.displayName || 'User'}`,
      status: 'success',
      duration: TOAST_DURATION.MEDIUM,
      isClosable: true,
    });
    navigate(from, { replace: true });
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

  function handleEmailContinue() {
    toast({
      title: 'Secure Authentication',
      description: 'To protect your account, email password login is disabled on dev. Please complete sign-in using the "Continue with Google" button below.',
      status: 'info',
      duration: TOAST_DURATION.LONG,
      isClosable: true,
    });
  }

  function handleMockProviderClick(provider: string) {
    toast({
      title: `${provider} Coming Soon`,
      description: `Integration for ${provider} is currently being established. Please sign in securely with Google.`,
      status: 'info',
      duration: TOAST_DURATION.MEDIUM,
      isClosable: true,
    });
  }

  // Show premium fullscreen loader while checking auth state
  if (isLoading) {
    return (
      <Flex minH="100vh" bg="#0B0A0F" align="center" justify="center">
        <VStack spacing={6}>
          <Logo size="lg" colorScheme="dark" />
          <Text color="gray.400" fontSize="sm" letterSpacing="wide">
            Verifying secure credentials...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="#0B0A0F" direction={{ base: 'column', md: 'row' }} overflow="hidden">
      
      {/* LEFT COLUMN: Premium Dark Auth Panel */}
      <Flex
        flex={{ base: '1', md: '0 0 520px', lg: '0 0 560px' }}
        direction="column"
        justify="space-between"
        px={{ base: 6, sm: 10, md: 14 }}
        py={{ base: 8, md: 12 }}
        bg="#0C0B10"
        borderRight="1px solid"
        borderColor="gray.900"
        position="relative"
        zIndex="2"
      >
        {/* Brand Logo Header */}
        <Box>
          <Logo size="md" colorScheme="dark" onClick={() => navigate(ROUTES.HOME)} />
        </Box>

        {/* Form Container */}
        <Box my="auto" py={{ base: 8, md: 4 }} maxW="380px" mx="auto" w="full">
          <VStack spacing={6} align="stretch">
            
            {/* Typography Header */}
            <Box>
              <Heading
                fontSize={{ base: '2xl', md: '3xl' }}
                color="white"
                fontWeight="600"
                letterSpacing="-0.02em"
                mb={2}
              >
                BookEasy for professionals
              </Heading>
              <Text fontSize="sm" color="gray.400" lineHeight="relaxed">
                Create an account or log in to manage your business.
              </Text>
            </Box>

            {/* Social Authentication Methods */}
            <VStack spacing={4} align="stretch">
              
              <Checkbox
                colorScheme="brand"
                size="md"
                isChecked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                borderColor="gray.600"
                alignItems="flex-start"
              >
                <Text fontSize="xs" color="gray.400" lineHeight="1.4" mt="-2px">
                  I agree to the{' '}
                  <Link color="brand.300" _hover={{ color: 'brand.200' }} onClick={() => navigate(ROUTES.TERMS)}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link color="brand.300" _hover={{ color: 'brand.200' }} onClick={() => navigate(ROUTES.PRIVACY)}>Privacy Policy</Link>
                </Text>
              </Checkbox>

              {/* Google Button (Fully Functional) */}
              <GoogleButton
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
                isDisabled={!termsAccepted}
                text="Continue with Google"
                h="54px"
                bg="white"
                color="black"
                border="none"
                borderRadius="full"
                fontWeight="600"
                fontSize="sm"
                _hover={{ bg: 'gray.200' }}
                _active={{ bg: 'gray.300' }}
                justifyContent="center"
              />
            </VStack>

            {/* Customer Portal Link */}
            <VStack spacing={1} pt={4} textAlign="center">
              <Text fontSize="xs" color="gray.400" fontWeight="500">
                Are you a customer looking to book an appointment?
              </Text>
              <Link
                onClick={() => navigate(ROUTES.HOME)}
                fontSize="xs"
                color="brand.300"
                fontWeight="600"
                _hover={{ color: 'brand.200', textDecoration: 'none' }}
              >
                Go to BookEasy for customers
              </Link>
            </VStack>

          </VStack>
        </Box>

        {/* Footer legalities and credits */}
        <VStack spacing={4} align="center" pt={4}>
          <Text fontSize="10px" color="gray.600" textAlign="center" maxW="280px" lineHeight="1.5">
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </Text>
          
          <HStack spacing={4} fontSize="xs" color="gray.500" justify="center">
            <Link _hover={{ color: 'white' }} display="inline-flex" alignItems="center">
              <WorldIcon /> English (US)
            </Link>
            <Text color="gray.800">•</Text>
            <Link onClick={() => handleMockProviderClick('Support')} _hover={{ color: 'white' }}>
              Support
            </Link>
            <Text color="gray.800">•</Text>
            <Link onClick={() => navigate(ROUTES.PRIVACY)} _hover={{ color: 'white' }}>
              Privacy Policy
            </Link>
          </HStack>
        </VStack>

      </Flex>

      {/* RIGHT COLUMN: Full-screen warm styling lifestyle Unsplash picture */}
      <Box
        flex="1"
        display={{ base: 'none', md: 'block' }}
        position="relative"
        bg="#0C0B10"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgImage="url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200')"
          bgSize="cover"
          bgPosition="center"
          filter="brightness(0.85) contrast(1.02)"
        />
        {/* Subtle dark ambient gradient overlay on image */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="linear-gradient(to right, rgba(12, 11, 16, 0.4) 0%, rgba(12, 11, 16, 0) 100%)"
        />
      </Box>

    </Flex>
  );
}
