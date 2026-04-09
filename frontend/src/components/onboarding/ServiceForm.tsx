import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Select,
  Checkbox,
  CheckboxGroup,
  Button,
  InputGroup,
  InputLeftElement,
  Text,
  Flex,
  Wrap,
  WrapItem,
  Textarea,
  Image,
  Collapse,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  SERVICE_DURATIONS,
  DAYS_OF_WEEK,
  DAY_SHORT_LABELS,
  type DayOfWeek,
} from '../../constants';
import { useGetServiceCategoriesQuery } from '../../store/api/servicesApi';
import { ChevronDownIcon } from '../icons';
import type { WorkingHours } from '../../types';

const MotionBox = motion.create(Box);

// Default working hours - all days open 9-5
const defaultWorkingHours: WorkingHours = {
  monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  saturday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  sunday: { isOpen: false, openTime: '09:00', closeTime: '17:00' },
};

/**
 * Service form data - used for both input and output
 */
export interface ServiceFormData {
  id?: string;
  name: string;
  price: number;
  durationMinutes: number;
  availableDays?: string[] | null;
  description?: string;
  imageUrl?: string;
  categoryId?: number | null;
}

interface ServiceFormProps {
  /** Initial values for editing. Pass null/undefined for create mode. */
  initialValues?: ServiceFormData | null;
  /** Business ID for category dropdown. Optional. */
  businessId?: number;
  /** Working hours for availability selection. Defaults to all weekdays open. */
  workingHours?: WorkingHours;
  /** Called when user submits the form */
  onSubmit: (data: ServiceFormData) => void;
  /** Called when user cancels */
  onCancel: () => void;
  /** Start with "More options" section expanded. Default: false */
  moreOptionsExpanded?: boolean;
}

interface FormErrors {
  name?: string;
  durationMinutes?: string;
  price?: string;
}

export function ServiceForm({
  initialValues,
  businessId,
  workingHours = defaultWorkingHours,
  onSubmit,
  onCancel,
  moreOptionsExpanded = false,
}: ServiceFormProps) {
  // Derive isEditing from initialValues
  const isEditing = initialValues != null;

  // Form state
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl || '');
  const [categoryId, setCategoryId] = useState<number | null>(initialValues?.categoryId ?? null);
  const [durationMinutes, setDurationMinutes] = useState(
    initialValues?.durationMinutes || 30
  );
  const [price, setPrice] = useState(initialValues?.price?.toString() || '');
  const [useAllDays, setUseAllDays] = useState(
    !initialValues?.availableDays || initialValues.availableDays.length === 0
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialValues?.availableDays || []
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageError, setImageError] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(moreOptionsExpanded);

  // Fetch categories if businessId is provided
  const { data: categories = [] } = useGetServiceCategoriesQuery(businessId || 0, {
    skip: !businessId,
  });

  // Get open days from working hours
  const openDays = DAYS_OF_WEEK.filter((day) => workingHours[day]?.isOpen);

  useEffect(() => {
    if (useAllDays) {
      setSelectedDays([]);
    }
  }, [useAllDays]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!durationMinutes) {
      newErrors.durationMinutes = 'Duration is required';
    }

    if (!price || parseFloat(price) < 0) {
      newErrors.price = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      id: initialValues?.id,
      name: name.trim(),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      categoryId: categoryId || null,
      durationMinutes,
      price: parseFloat(price),
      availableDays: useAllDays ? null : selectedDays,
    });
  };

  return (
    <MotionBox
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      overflow="hidden"
    >
      <Box
        bg="gray.50"
        border="1px"
        borderColor="gray.200"
        borderRadius="xl"
        p={5}
      >
        <VStack spacing={4} align="stretch">
          {/* Service Name */}
          <FormControl isInvalid={!!errors.name}>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
              Service Name
            </FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Haircut, Massage, Consultation"
              size="md"
              bg="white"
              borderRadius="lg"
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
              }}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          {/* Duration and Price */}
          <HStack spacing={4} align="flex-start">
            <FormControl isInvalid={!!errors.durationMinutes} flex={1}>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                Duration
              </FormLabel>
              <Select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                size="md"
                bg="white"
                borderRadius="lg"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                }}
              >
                {SERVICE_DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.durationMinutes}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.price} flex={1}>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                Price
              </FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.400"
                  fontSize="md"
                >
                  $
                </InputLeftElement>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  bg="white"
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                  }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>
          </HStack>

          {/* Availability */}
          <Box>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
              Availability
            </FormLabel>
            <Checkbox
              isChecked={useAllDays}
              onChange={(e) => setUseAllDays(e.target.checked)}
              colorScheme="brand"
              mb={3}
            >
              <Text fontSize="sm">Available all open days</Text>
            </Checkbox>

            {!useAllDays && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CheckboxGroup
                  value={selectedDays}
                  onChange={(values) => setSelectedDays(values as string[])}
                >
                  <Wrap spacing={2}>
                    {DAYS_OF_WEEK.map((day) => {
                      const isOpen = openDays.includes(day);
                      return (
                        <WrapItem key={day}>
                          <Checkbox
                            value={day}
                            isDisabled={!isOpen}
                            colorScheme="brand"
                            size="md"
                          >
                            <Text
                              fontSize="sm"
                              color={isOpen ? 'gray.700' : 'gray.400'}
                            >
                              {DAY_SHORT_LABELS[day as DayOfWeek]}
                            </Text>
                          </Checkbox>
                        </WrapItem>
                      );
                    })}
                  </Wrap>
                </CheckboxGroup>
                {selectedDays.length === 0 && !useAllDays && (
                  <Text fontSize="xs" color="orange.500" mt={2}>
                    Please select at least one day
                  </Text>
                )}
              </MotionBox>
            )}
          </Box>

          {/* More Options - Always show toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            rightIcon={
              <Box
                transform={showMoreOptions ? 'rotate(180deg)' : 'rotate(0deg)'}
                transition="transform 0.2s"
              >
                <ChevronDownIcon size={16} />
              </Box>
            }
            color="gray.500"
            fontWeight="500"
            px={0}
            _hover={{ bg: 'transparent', color: 'gray.700' }}
          >
            {showMoreOptions ? 'Less options' : 'More options'}
          </Button>

          <Collapse in={showMoreOptions}>
            <VStack spacing={4} align="stretch">
              {/* Category Selection */}
              {categories.length > 0 && (
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                    Category
                  </FormLabel>
                  <Select
                    value={categoryId || ''}
                    onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                    size="md"
                    bg="white"
                    borderRadius="lg"
                    placeholder="Select a category (optional)"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Description */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                  Description
                </FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this service..."
                  size="md"
                  bg="white"
                  borderRadius="lg"
                  rows={2}
                  maxLength={500}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                  }}
                />
                <FormHelperText fontSize="xs">
                  {description.length}/500 characters
                </FormHelperText>
              </FormControl>

              {/* Image URL */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                  Image URL
                </FormLabel>
                <Input
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageError(false);
                  }}
                  placeholder="https://example.com/service-image.jpg"
                  size="md"
                  bg="white"
                  borderRadius="lg"
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                  }}
                />
                <FormHelperText fontSize="xs">
                  Optional: Add an image for this service
                </FormHelperText>
                {imageUrl && !imageError && (
                  <Box mt={2} borderRadius="lg" overflow="hidden" maxH="100px">
                    <Image
                      src={imageUrl}
                      alt="Service preview"
                      maxH="100px"
                      objectFit="cover"
                      onError={() => setImageError(true)}
                    />
                  </Box>
                )}
                {imageError && (
                  <Text fontSize="xs" color="orange.500" mt={1}>
                    Unable to load image preview
                  </Text>
                )}
              </FormControl>
            </VStack>
          </Collapse>

          {/* Actions */}
          <Flex justify="flex-end" gap={2} pt={2}>
            <Button
              variant="ghost"
              size="md"
              onClick={onCancel}
              borderRadius="lg"
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              size="md"
              onClick={handleSubmit}
              borderRadius="lg"
              isDisabled={!useAllDays && selectedDays.length === 0}
            >
              {isEditing ? 'Update' : 'Add Service'}
            </Button>
          </Flex>
        </VStack>
      </Box>
    </MotionBox>
  );
}
