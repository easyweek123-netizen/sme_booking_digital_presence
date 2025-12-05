import { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Text,
  Heading,
  Link,
  Divider,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { PrimaryButton } from '../ui/PrimaryButton';
import { useLoginMutation, useRegisterMutation } from '../../store/api/authApi';
import { useCreateBusinessMutation } from '../../store/api/businessApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';
import { resetOnboarding } from '../../store/slices/onboardingSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { TOAST_DURATION } from '../../constants';

const MotionBox = motion.create(Box);

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function AuthStep() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { businessProfile, services } = useAppSelector((state) => state.onboarding);
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [createBusiness, { isLoading: isCreatingBusiness }] = useCreateBusinessMutation();

  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const isLoading = isLoginLoading || isRegisterLoading || isCreatingBusiness;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isLoginMode && !name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isLoginMode && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // Step 1: Authenticate
      let authResult;
      if (isLoginMode) {
        authResult = await login({ email, password }).unwrap();
      } else {
        authResult = await register({ email, password, name }).unwrap();
      }

      // Store credentials
      dispatch(setCredentials({ user: authResult.user, token: authResult.token }));

      // Step 2: Create business
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

      // Step 3: Clear onboarding and redirect
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
        title: isLoginMode ? 'Login failed' : 'Registration failed',
        description: err.data?.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.LONG,
        isClosable: true,
      });
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrors({});
  };

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
            {isLoginMode ? 'Welcome Back' : 'Create Your Account'}
          </Heading>
          <Text color="gray.600">
            {isLoginMode
              ? 'Sign in to complete your business setup'
              : "You're almost done! Create an account to save your business."}
          </Text>
        </Box>

        {/* Form */}
        <VStack
          as="form"
          onSubmit={handleSubmit}
          spacing={5}
          bg="white"
          p={6}
          borderRadius="xl"
          border="1px"
          borderColor="gray.100"
        >
          {/* Name field (signup only) */}
          {!isLoginMode && (
            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                Full Name
              </FormLabel>
              <Input
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
          )}

          {/* Email */}
          <FormControl isInvalid={!!errors.email}>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
              Email
            </FormLabel>
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

          {/* Password */}
          <FormControl isInvalid={!!errors.password}>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
              Password
            </FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLoginMode ? 'Enter your password' : 'At least 6 characters'}
              size="lg"
              borderRadius="lg"
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
              }}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            isLoading={isLoading}
            loadingText={isCreatingBusiness ? 'Creating business...' : 'Please wait...'}
            w="full"
            size="lg"
            showArrow={false}
          >
            {isLoginMode ? 'Sign In & Create Business' : 'Create Account & Business'}
          </PrimaryButton>

          {/* Toggle mode */}
          <HStack w="full" spacing={4}>
            <Divider />
            <Text color="gray.500" fontSize="sm" whiteSpace="nowrap">
              or
            </Text>
            <Divider />
          </HStack>

          <Text color="gray.600" textAlign="center" fontSize="sm">
            {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link
              color="brand.500"
              fontWeight="600"
              onClick={toggleMode}
              cursor="pointer"
              _hover={{ textDecoration: 'underline' }}
            >
              {isLoginMode ? 'Sign up' : 'Sign in'}
            </Link>
          </Text>
        </VStack>
      </VStack>
    </MotionBox>
  );
}

