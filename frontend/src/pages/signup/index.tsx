import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useToast,
  Link,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { Logo } from '../../components/ui/Logo';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useRegisterMutation } from '../../store/api/authApi';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';
import { ROUTES } from '../../config/routes';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await register({ email, password, name }).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      toast({
        title: 'Account created!',
        description: 'Welcome to BookEasy',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate(ROUTES.DASHBOARD.ROOT);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: 'Registration failed',
        description: err.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" py={20}>
      <Container maxW="md">
        <VStack spacing={8}>
          <Logo size="lg" onClick={() => navigate(ROUTES.HOME)} />
          
          <VStack
            as="form"
            onSubmit={handleSubmit}
            spacing={6}
            bg="white"
            p={8}
            borderRadius="xl"
            boxShadow="sm"
            w="full"
          >
            <VStack spacing={2} textAlign="center">
              <Heading size="lg" color="gray.900">
                Create your account
              </Heading>
              <Text color="gray.600">
                Start managing your bookings in minutes
              </Text>
            </VStack>

            <FormControl isInvalid={!!errors.name}>
              <FormLabel color="gray.700">Full name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                size="lg"
                borderRadius="lg"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                }}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel color="gray.700">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                size="lg"
                borderRadius="lg"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                }}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel color="gray.700">Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                size="lg"
                borderRadius="lg"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                }}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel color="gray.700">Confirm password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                size="lg"
                borderRadius="lg"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                }}
              />
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <PrimaryButton
              type="submit"
              isLoading={isLoading}
              loadingText="Creating account..."
              w="full"
              size="lg"
              showArrow={false}
            >
              Create account
            </PrimaryButton>

            <HStack w="full" spacing={4}>
              <Divider />
              <Text color="gray.500" fontSize="sm" whiteSpace="nowrap">
                or
              </Text>
              <Divider />
            </HStack>

            <Text color="gray.600" textAlign="center">
              Already have an account?{' '}
              <Link
                as={RouterLink}
                to={ROUTES.LOGIN}
                color="brand.500"
                fontWeight="600"
                _hover={{ textDecoration: 'underline' }}
              >
                Sign in
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

