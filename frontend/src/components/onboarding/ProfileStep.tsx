import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Text,
  Heading,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { WorkingHoursEditor } from './WorkingHoursEditor';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateBusinessProfile,
  defaultWorkingHours,
} from '../../store/slices/onboardingSlice';
import type { WorkingHours } from '../../types';

const MotionBox = motion.create(Box);

interface FormErrors {
  name?: string;
}

export function ProfileStep() {
  const dispatch = useAppDispatch();
  const { businessProfile } = useAppSelector((state) => state.onboarding);

  const [name, setName] = useState(businessProfile?.name || '');
  const [phone, setPhone] = useState(businessProfile?.phone || '');
  const [description, setDescription] = useState(businessProfile?.description || '');
  const [address, setAddress] = useState(businessProfile?.address || '');
  const [city, setCity] = useState(businessProfile?.city || '');
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    businessProfile?.workingHours || defaultWorkingHours
  );
  const [errors, setErrors] = useState<FormErrors>({});

  // Auto-save to Redux on change
  useEffect(() => {
    const profile = {
      name,
      phone,
      description,
      address,
      city,
      workingHours,
    };
    dispatch(updateBusinessProfile(profile));
  }, [name, phone, description, address, city, workingHours, dispatch]);

  // Validate name field
  useEffect(() => {
    if (name.trim()) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  }, [name]);

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
            Business Profile
          </Heading>
          <Text color="gray.600">
            Tell us about your business
          </Text>
        </Box>

        {/* Business Name */}
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
            Business Name
          </FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Sarah's Salon"
            size="lg"
            borderRadius="lg"
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            }}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        {/* Working Hours */}
        <Box>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700" mb={3}>
            Working Hours
          </FormLabel>
          <WorkingHoursEditor
            value={workingHours}
            onChange={setWorkingHours}
          />
        </Box>

        {/* Phone */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
            Phone Number
            <Text as="span" color="gray.400" fontWeight="400" ml={1}>
              (optional)
            </Text>
          </FormLabel>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            size="lg"
            borderRadius="lg"
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            }}
          />
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
            Description
            <Text as="span" color="gray.400" fontWeight="400" ml={1}>
              (optional)
            </Text>
          </FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell your customers about your business..."
            size="lg"
            borderRadius="lg"
            rows={3}
            resize="none"
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            }}
          />
        </FormControl>

        {/* Address */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
            Address
            <Text as="span" color="gray.400" fontWeight="400" ml={1}>
              (optional)
            </Text>
          </FormLabel>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main Street"
            size="lg"
            borderRadius="lg"
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            }}
          />
        </FormControl>

        {/* City */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
            City
            <Text as="span" color="gray.400" fontWeight="400" ml={1}>
              (optional)
            </Text>
          </FormLabel>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="New York"
            size="lg"
            borderRadius="lg"
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            }}
          />
        </FormControl>
      </VStack>
    </MotionBox>
  );
}

