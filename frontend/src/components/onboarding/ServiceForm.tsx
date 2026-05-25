import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Checkbox,
  CheckboxGroup,
  Button,
  Text,
  Flex,
  Wrap,
  WrapItem,
  Image,
  Collapse,
} from '@chakra-ui/react';
import { useForm, FormProvider, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { serviceFormSchema, type ServiceFormValues } from './serviceFormSchema';
import {
  SERVICE_DURATIONS,
  DAYS_OF_WEEK,
  DAY_SHORT_LABELS,
  type DayOfWeek,
} from '../../constants';
import { useGetServiceCategoriesQuery } from '../../store/api/servicesApi';
import { ChevronDownIcon } from '../icons';
import type { WorkingHours } from '../../types';
import { TextField, TextAreaField, CurrencyField, SubmitButton } from '../ui/form';

const MotionBox = motion.create(Box);

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
  /** Is loading */
  isLoading?: boolean;
}

export function ServiceForm({
  initialValues,
  businessId,
  workingHours = defaultWorkingHours,
  onSubmit: onSubmitProp,
  onCancel,
  moreOptionsExpanded = false,
  isLoading = false,
}: ServiceFormProps) {
  const isEditing = initialValues != null;

  // UX state — not form-field state
  const [useAllDays, setUseAllDays] = useState(
    !initialValues?.availableDays || initialValues.availableDays.length === 0
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialValues?.availableDays || []
  );
  const [imageError, setImageError] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(moreOptionsExpanded);

  const { data: categories = [] } = useGetServiceCategoriesQuery(businessId || 0, {
    skip: !businessId,
  });

  const openDays = DAYS_OF_WEEK.filter((day) => workingHours[day]?.isOpen);

  const methods = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      durationMinutes: initialValues?.durationMinutes || 30,
      price: initialValues?.price ?? 0,
      description: initialValues?.description || '',
      imageUrl: initialValues?.imageUrl || '',
      categoryId: initialValues?.categoryId ?? null,
      availableDays: initialValues?.availableDays ?? null,
    },
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const imageUrl = useWatch({ control, name: 'imageUrl' });

  // Keep availableDays form value in sync with UX state
  useEffect(() => {
    setValue('availableDays', useAllDays ? null : selectedDays, { shouldValidate: false });
  }, [useAllDays, selectedDays, setValue]);

  const onSubmit = (data: ServiceFormValues) => {
    onSubmitProp({
      id: initialValues?.id,
      name: data.name,
      description: data.description || undefined,
      imageUrl: data.imageUrl || undefined,
      categoryId: data.categoryId ?? null,
      durationMinutes: data.durationMinutes,
      price: data.price,
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
        bg="surface.muted"
        border="1px"
        borderColor="border.subtle"
        borderRadius="xl"
        p={5}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              {/* Service Name */}
              <TextField<ServiceFormValues>
                name="name"
                label="Service Name"
                placeholder="e.g., Haircut, Massage, Consultation"
              />

              {/* Duration and Price */}
              <HStack spacing={4} align="flex-start">
                <Box flex={1}>
                  <Controller
                    name="durationMinutes"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl isInvalid={!!fieldState.error}>
                        <FormLabel>Duration</FormLabel>
                        <Select
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        >
                          {SERVICE_DURATIONS.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </Select>
                        {fieldState.error && (
                          <FormErrorMessage>{fieldState.error.message}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <CurrencyField<ServiceFormValues> name="price" label="Price" currency="€" />
                </Box>
              </HStack>

              {/* Availability */}
              <Box>
                <FormLabel mb={2}>Availability</FormLabel>
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
                                  color={isOpen ? 'text.primary' : 'text.muted'}
                                >
                                  {DAY_SHORT_LABELS[day as DayOfWeek]}
                                </Text>
                              </Checkbox>
                            </WrapItem>
                          );
                        })}
                      </Wrap>
                    </CheckboxGroup>
                    {errors.availableDays && (
                      <Text fontSize="xs" color="danger.primary" mt={2}>
                        {errors.availableDays.message}
                      </Text>
                    )}
                  </MotionBox>
                )}
              </Box>

              {/* More Options toggle */}
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
                color="text.muted"
                fontWeight="500"
                px={0}
                _hover={{ bg: 'transparent', color: 'text.primary' }}
              >
                {showMoreOptions ? 'Less options' : 'More options'}
              </Button>

              <Collapse in={showMoreOptions}>
                <VStack spacing={4} align="stretch">
                  {/* Category Selection */}
                  {categories.length > 0 && (
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <FormControl>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(e.target.value ? Number(e.target.value) : null)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            placeholder="Select a category (optional)"
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  )}

                  {/* Description */}
                  <TextAreaField<ServiceFormValues>
                    name="description"
                    label="Description"
                    placeholder="Describe this service..."
                    rows={2}
                    maxLength={500}
                    showCount
                  />

                  {/* Image URL */}
                  <Box>
                    <TextField<ServiceFormValues>
                      name="imageUrl"
                      label="Image URL"
                      placeholder="https://example.com/service-image.jpg"
                      helperText="Optional: Add an image for this service"
                      type="url"
                    />
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
                      <Text fontSize="xs" color="text.muted" mt={1}>
                        Unable to load image preview
                      </Text>
                    )}
                  </Box>
                </VStack>
              </Collapse>

              {/* Actions */}
              <Flex justify="flex-end" gap={2} pt={2}>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={onCancel}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <SubmitButton isLoading={isLoading} size="md">
                  {isEditing ? 'Update' : 'Add Service'}
                </SubmitButton>
              </Flex>
            </VStack>
          </form>
        </FormProvider>
      </Box>
    </MotionBox>
  );
}
