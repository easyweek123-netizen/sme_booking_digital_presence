import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Text,
  Heading,
  Button,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { WorkingHoursEditor } from './WorkingHoursEditor';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateBusinessProfile,
  defaultWorkingHours,
} from '../../store/slices/onboardingSlice';
import type { WorkingHours } from '../../types';
import { ChevronDownIcon } from '../icons';
import { DEFAULT_BRAND_COLOR } from '../../utils/brandColor';

const MotionBox = motion.create(Box);

interface FormErrors {
  name?: string;
}

export function ProfileStep() {
  const dispatch = useAppDispatch();
  const { businessProfile } = useAppSelector((state) => state.onboarding);
  const { isOpen: showMore, onToggle: toggleMore } = useDisclosure();

  const [name, setName] = useState(businessProfile?.name || '');
  const [phone, setPhone] = useState(businessProfile?.phone || '');
  const [description, setDescription] = useState(businessProfile?.description || '');
  const [address, setAddress] = useState(businessProfile?.address || '');
  const [city, setCity] = useState(businessProfile?.city || '');
  const [logoUrl, setLogoUrl] = useState(businessProfile?.logoUrl || '');
  const [brandColor, setBrandColor] = useState(businessProfile?.brandColor || '');
  const [localColor, setLocalColor] = useState(brandColor || DEFAULT_BRAND_COLOR);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    businessProfile?.workingHours || defaultWorkingHours
  );
  const [errors, setErrors] = useState<FormErrors>({});

  // Sync local color when brandColor changes externally
  useEffect(() => {
    setLocalColor(brandColor || DEFAULT_BRAND_COLOR);
  }, [brandColor]);

  const handleColorBlur = () => {
    if (localColor !== (brandColor || DEFAULT_BRAND_COLOR)) {
      setBrandColor(localColor === DEFAULT_BRAND_COLOR ? '' : localColor);
    }
  };

  // Auto-save to Redux on change
  useEffect(() => {
    const profile = {
      name,
      phone,
      description,
      address,
      city,
      logoUrl,
      brandColor,
      workingHours,
    };
    dispatch(updateBusinessProfile(profile));
  }, [name, phone, description, address, city, logoUrl, brandColor, workingHours, dispatch]);

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
      <VStack spacing={5} align="stretch">
        {/* Header */}
        <Box textAlign="center" mb={2}>
          <Heading size="lg" color="gray.900" mb={2}>
            Business Profile
          </Heading>
          <Text color="gray.600">
            Tell us about your business
          </Text>
        </Box>

        {/* Essential Fields */}
        <VStack spacing={3} align="stretch">
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

          {/* Brand Color - Simple inline picker */}
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
              Brand Color
            </FormLabel>
            <HStack spacing={3}>
              <Box
                as="label"
                w="48px"
                h="48px"
                borderRadius="xl"
                bg={localColor}
                cursor="pointer"
                border="2px"
                borderColor={brandColor ? 'gray.300' : 'gray.200'}
                _hover={{ transform: 'scale(1.03)', borderColor: 'gray.400' }}
                transition="all 0.15s"
                position="relative"
                overflow="hidden"
                flexShrink={0}
                boxShadow={brandColor ? 'sm' : 'none'}
              >
                <Input
                  type="color"
                  value={localColor}
                  onChange={(e) => setLocalColor(e.target.value)}
                  onBlur={handleColorBlur}
                  position="absolute"
                  top={0}
                  left={0}
                  w="200%"
                  h="200%"
                  opacity={0}
                  cursor="pointer"
                />
              </Box>
              <Input
                value={brandColor ? brandColor.toUpperCase() : ''}
                placeholder="Click to pick or enter hex"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setBrandColor(val.startsWith('#') ? val : val ? `#${val}` : '');
                    setLocalColor(val.startsWith('#') ? val : val ? `#${val}` : DEFAULT_BRAND_COLOR);
                  }
                }}
                size="lg"
                borderRadius="lg"
                fontFamily="mono"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                }}
              />
            </HStack>
          </FormControl>
        </VStack>

        {/* Optional Fields Toggle */}
        <Box textAlign="center">
          <Button
            variant="ghost"
            size="sm"
            rightIcon={
              <Box
                transform={showMore ? 'rotate(180deg)' : 'rotate(0deg)'}
                transition="transform 0.2s"
              >
                <ChevronDownIcon size={16} />
              </Box>
            }
            onClick={toggleMore}
            color="gray.600"
            _hover={{ bg: 'transparent', color: 'brand.500' }}
            fontWeight="500"
            fontSize="sm"
          >
            <Box textAlign="center">
              <Text as="span" display="block">Add logo, hours & more</Text>
              <Text as="span" display="block" fontSize="xs" color="gray.400" fontWeight="400">
                You can do this later
              </Text>
            </Box>
          </Button>
        </Box>

        {/* Collapsible Optional Fields */}
        <Collapse in={showMore}>
          <VStack spacing={5} align="stretch" pt={2}>
            {/* Logo URL */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                Logo URL
              </FormLabel>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/your-logo.png"
                size="lg"
                borderRadius="lg"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                }}
              />
            </FormControl>

            {/* Working Hours */}
            <WorkingHoursEditor
              value={workingHours}
              onChange={setWorkingHours}
            />

            {/* Phone */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                Phone Number
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

            {/* Location (Address + City) */}
            <HStack spacing={4} align="start">
              <FormControl flex={2}>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                  Address
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

              <FormControl flex={1}>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                  City
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
            </HStack>
          </VStack>
        </Collapse>
      </VStack>
    </MotionBox>
  );
}

