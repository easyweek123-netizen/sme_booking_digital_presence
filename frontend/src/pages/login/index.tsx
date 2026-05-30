import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
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

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { firebaseUser, isLoading } = useAuth();
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

  // Show premium fullscreen loader while checking auth state
  if (isLoading) {
    return (
      <Flex minH="100vh" bg="surface.page" align="center" justify="center">
        <VStack spacing={6}>
          <Logo size="lg" colorScheme="light" />
          <Text color="text.muted" fontSize="sm" letterSpacing="wide">
            Verifying secure credentials...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="surface.page" direction={{ base: 'column', md: 'row' }} overflow="hidden">

      {/* LEFT COLUMN: Auth Panel */}
      <Flex
        flex={{ base: '1', md: '0 0 520px', lg: '0 0 560px' }}
        direction="column"
        justify="space-between"
        px={{ base: 6, sm: 10, md: 14 }}
        py={{ base: 8, md: 12 }}
        bg="surface.card"
        borderRight="1px solid"
        borderColor="border.subtle"
        position="relative"
        zIndex="2"
      >
        {/* Brand Logo Header */}
        <Box>
          <Logo size="md" colorScheme="light" onClick={() => navigate(ROUTES.HOME)} />
        </Box>

        {/* Form Container */}
        <Box my="auto" py={{ base: 8, md: 4 }} maxW="380px" mx="auto" w="full">
          <VStack spacing={6} align="stretch">

            {/* Typography Header */}
            <Box>
              <Heading
                fontSize={{ base: '2xl', md: '3xl' }}
                color="text.heading"
                fontWeight="600"
                letterSpacing="-0.02em"
                mb={2}
              >
                BookEasy for professionals
              </Heading>
              <Text fontSize="sm" color="text.secondary" lineHeight="relaxed">
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
                borderColor="border.strong"
                alignItems="flex-start"
                justifyContent="center"
              >
                <Text fontSize="xs" color="text.secondary" lineHeight="1.4" mt="-2px">
                  I agree to the{' '}
                  <Link color="accent.primary" _hover={{ color: 'accent.hover' }} onClick={() => navigate(ROUTES.TERMS)}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link color="accent.primary" _hover={{ color: 'accent.hover' }} onClick={() => navigate(ROUTES.PRIVACY)}>Privacy Policy</Link>
                </Text>
              </Checkbox>

              {/* Google Button */}
              <GoogleButton
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
                isDisabled={!termsAccepted}
                text="Continue with Google"
                h="54px"
                bg="surface.card"
                color="text.primary"
                borderWidth="1px"
                borderColor="border.strong"
                borderRadius="full"
                fontWeight="600"
                fontSize="sm"
                _hover={{ bg: 'surface.muted' }}
                _active={{ bg: 'surface.muted' }}
                justifyContent="center"
              />
            </VStack>

          </VStack>
        </Box>

        <HStack spacing={4} fontSize="xs" justify="center">
          <Text color="text.faint">•</Text>
          <Link color="text.muted" onClick={() => navigate(ROUTES.PRIVACY)} _hover={{ color: 'text.primary' }}>
            Privacy Policy
          </Link>
        </HStack>

      </Flex>

      {/* RIGHT COLUMN: Lifestyle image */}
      <Box
        flex="1"
        display={{ base: 'none', md: 'block' }}
        position="relative"
        bg="surface.muted"
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
          filter="brightness(0.9) contrast(1.02)"
        />
        {/* Subtle left-edge gradient to blend with the card panel */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="linear-gradient(to right, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 30%)"
        />
      </Box>

    </Flex>
  );
}
