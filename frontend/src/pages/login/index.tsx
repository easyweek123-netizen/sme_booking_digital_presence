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
                justifyContent="center"
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

          </VStack>
        </Box>

        <HStack spacing={4} fontSize="xs" color="gray.500" justify="center">
          <Text color="gray.800">•</Text>
          <Link onClick={() => navigate(ROUTES.PRIVACY)} _hover={{ color: 'white' }}>
            Privacy Policy
          </Link>
        </HStack>

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
