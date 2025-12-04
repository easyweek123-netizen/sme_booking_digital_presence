import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  SERVICE_DURATIONS,
  DAYS_OF_WEEK,
  DAY_SHORT_LABELS,
  type DayOfWeek,
} from '../../constants';
import type { ServiceItem } from '../../types';
import type { WorkingHours } from '../../types';

const MotionBox = motion.create(Box);

interface ServiceFormProps {
  initialValues?: ServiceItem | null;
  workingHours: WorkingHours;
  onSave: (service: Omit<ServiceItem, 'id'> & { id?: string }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

interface FormErrors {
  name?: string;
  durationMinutes?: string;
  price?: string;
}

export function ServiceForm({
  initialValues,
  workingHours,
  onSave,
  onCancel,
  isEditing = false,
}: ServiceFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
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

    onSave({
      id: initialValues?.id,
      name: name.trim(),
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

