import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
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

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <Box minH="100vh" bg="surface.alt" py={20}>
        <Container maxW="md">
          <VStack spacing={8}>
            <Logo size="lg" />
            <Text color="text.secondary">Loading...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="surface.alt" py={20}>
      <Container maxW="md">
        <VStack spacing={8}>
          <Logo size="lg" onClick={() => navigate(ROUTES.HOME)} />

          <VStack
            spacing={6}
            bg="surface.card"
            p={8}
            borderRadius="xl"
            boxShadow="sm"
            w="full"
          >
            <VStack spacing={2} textAlign="center">
              <Heading size="lg" color="text.heading">
                Welcome to BookEasy
              </Heading>
              <Text color="text.secondary">
                Sign in with Google to manage your business
              </Text>
            </VStack>

            <GoogleButton
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />

            <Text color="text.muted" fontSize="xs" textAlign="center" pt={2}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
