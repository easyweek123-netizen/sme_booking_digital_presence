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
  Input,
  Textarea,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Heading,
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
import { useGetServiceCategoriesQuery } from '../../store/api/serviceCategoriesApi';
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
  /** Hide standard inline actions and trigger via HTML5 form ID */
  hideInlineActions?: boolean;
}

export function ServiceForm({
  initialValues,
  businessId,
  workingHours = defaultWorkingHours,
  onSubmit: onSubmitProp,
  onCancel,
  moreOptionsExpanded = false,
  isLoading = false,
  hideInlineActions = false,
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

  // Watch input values for live character counters and previews
  const nameValue = useWatch({ control, name: 'name' }) || '';
  const descValue = useWatch({ control, name: 'description' }) || '';
  const imageUrl = useWatch({ control, name: 'imageUrl' }) || '';

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

  // PREMIUM DARK SPLIT-SCREEN LAYOUT FOR DASHBOARD
  if (hideInlineActions) {
    return (
      <Box bg="#0C0B10" minH="calc(100vh - 80px)" color="white" py={8} px={{ base: 6, md: 10 }}>
        <FormProvider {...methods}>
          <form id="service-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Centered Form Container */}
            <Box maxW="760px" mx="auto" w="100%">
              <VStack spacing={10} align="stretch">
                  
                  {/* SECTION 1: Basic Details */}
                  <Box>
                    <Heading fontSize="lg" fontWeight="700" color="white" mb={6} letterSpacing="-0.01em">
                      Basic details
                    </Heading>
                    <VStack spacing={6} align="stretch">
                      
                      {/* Service Name Input */}
                      <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                          <FormControl isInvalid={!!fieldState.error}>
                            <Flex justify="space-between" mb={2}>
                              <FormLabel m={0} fontSize="sm" fontWeight="600" color="white">
                                Service name
                              </FormLabel>
                              <Text fontSize="xs" color="whiteAlpha.450" fontWeight="500">
                                {nameValue.length}/255
                              </Text>
                            </Flex>
                            <Input
                              {...field}
                              placeholder="Add a service name, e.g. Men's Haircut"
                              bg="#16151A"
                              border="1px solid"
                              borderColor="#29282D"
                              color="white"
                              h="46px"
                              borderRadius="xl"
                              maxLength={255}
                              _hover={{ borderColor: 'whiteAlpha.350' }}
                              _focus={{ borderColor: 'white', boxShadow: 'none' }}
                              _placeholder={{ color: 'whiteAlpha.400' }}
                            />
                            {fieldState.error && (
                              <FormErrorMessage color="danger.primary">{fieldState.error.message}</FormErrorMessage>
                            )}
                          </FormControl>
                        )}
                      />

                      {/* Menu Category & Treatment Type Selects */}
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        
                        {/* Menu Category */}
                        <Controller
                          name="categoryId"
                          control={control}
                          render={({ field, fieldState }) => (
                            <FormControl isInvalid={!!fieldState.error}>
                              <FormLabel fontSize="sm" fontWeight="600" color="white" mb={2}>
                                Menu category
                              </FormLabel>
                              <Select
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                bg="#16151A"
                                border="1px solid"
                                borderColor="#29282D"
                                color="white"
                                h="46px"
                                borderRadius="xl"
                                placeholder="Select category"
                                _hover={{ borderColor: 'whiteAlpha.350' }}
                                _focus={{ borderColor: 'white', boxShadow: 'none' }}
                                sx={{
                                  '& > option': {
                                    bg: '#16151A',
                                    color: 'white',
                                  },
                                }}
                              >
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </Select>
                              <Text fontSize="xs" color="whiteAlpha.400" mt={2} lineHeight="short">
                                The category displayed to you, and to clients online
                              </Text>
                              {fieldState.error && (
                                <FormErrorMessage color="danger.primary">{fieldState.error.message}</FormErrorMessage>
                              )}
                            </FormControl>
                          )}
                        />

                        {/* Treatment Type (Mock select) */}
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600" color="white" mb={2}>
                            Treatment type
                          </FormLabel>
                          <Select
                            bg="#16151A"
                            border="1px solid"
                            borderColor="#29282D"
                            color="white"
                            h="46px"
                            borderRadius="xl"
                            placeholder="Select treatment type"
                            _hover={{ borderColor: 'whiteAlpha.350' }}
                            _focus={{ borderColor: 'white', boxShadow: 'none' }}
                            sx={{
                              '& > option': {
                                bg: '#16151A',
                                color: 'white',
                              },
                            }}
                          >
                            <option value="hair">Hair Treatment</option>
                            <option value="barber">Barbering</option>
                            <option value="face">Face Care</option>
                          </Select>
                          <Text fontSize="xs" color="whiteAlpha.400" mt={2} lineHeight="short">
                            Used to help clients find your service on the marketplace
                          </Text>
                        </FormControl>

                      </SimpleGrid>

                      {/* Description (Optional) Textarea */}
                      <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                          <FormControl isInvalid={!!fieldState.error}>
                            <Flex justify="space-between" mb={2}>
                              <FormLabel m={0} fontSize="sm" fontWeight="600" color="white">
                                Description (Optional)
                              </FormLabel>
                              <Text fontSize="xs" color="whiteAlpha.450" fontWeight="500">
                                {descValue.length}/1000
                              </Text>
                            </Flex>
                            <Textarea
                              {...field}
                              placeholder="Add a short description"
                              bg="#16151A"
                              border="1px solid"
                              borderColor="#29282D"
                              color="white"
                              rows={4}
                              borderRadius="xl"
                              maxLength={1000}
                              _hover={{ borderColor: 'whiteAlpha.350' }}
                              _focus={{ borderColor: 'white', boxShadow: 'none' }}
                              _placeholder={{ color: 'whiteAlpha.400' }}
                              lineHeight="relaxed"
                            />
                            {fieldState.error && (
                              <FormErrorMessage color="danger.primary">{fieldState.error.message}</FormErrorMessage>
                            )}
                          </FormControl>
                        )}
                      />

                      {/* Optional Image URL */}
                      <Controller
                        name="imageUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                          <FormControl isInvalid={!!fieldState.error}>
                            <FormLabel fontSize="sm" fontWeight="600" color="white" mb={2}>
                              Service Image URL (Optional)
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="https://example.com/service-image.jpg"
                              bg="#16151A"
                              border="1px solid"
                              borderColor="#29282D"
                              color="white"
                              h="46px"
                              borderRadius="xl"
                              type="url"
                              _hover={{ borderColor: 'whiteAlpha.350' }}
                              _focus={{ borderColor: 'white', boxShadow: 'none' }}
                              _placeholder={{ color: 'whiteAlpha.400' }}
                            />
                            {imageUrl && !imageError && (
                              <Box mt={3} borderRadius="xl" overflow="hidden" maxW="200px" border="1px solid" borderColor="whiteAlpha.100">
                                <Image
                                  src={imageUrl}
                                  alt="Service preview"
                                  maxH="120px"
                                  w="100%"
                                  objectFit="cover"
                                  onError={() => setImageError(true)}
                                />
                              </Box>
                            )}
                            {fieldState.error && (
                              <FormErrorMessage color="danger.primary">{fieldState.error.message}</FormErrorMessage>
                            )}
                          </FormControl>
                        )}
                      />

                    </VStack>
                  </Box>

                  {/* SECTION 2: Pricing and Duration */}
                  <Box>
                    <Heading fontSize="lg" fontWeight="700" color="white" mb={6} letterSpacing="-0.01em">
                      Pricing and duration
                    </Heading>
                    <VStack spacing={6} align="stretch">
                      
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        
                        {/* Price Type */}
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600" color="white" mb={2}>
                            Price type
                          </FormLabel>
                          <Select
                            bg="#16151A"
                            border="1px solid"
                            borderColor="#29282D"
                            color="white"
                            h="46px"
                            borderRadius="xl"
                            defaultValue="fixed"
                            _hover={{ borderColor: 'whiteAlpha.350' }}
                            _focus={{ borderColor: 'white', boxShadow: 'none' }}
                            sx={{
                              '& > option': {
                                bg: '#16151A',
                                color: 'white',
                              },
                            }}
                          >
                            <option value="fixed">Fixed</option>
                            <option value="free">Free</option>
                          </Select>
                        </FormControl>

                        {/* Price Input */}
                        <Controller
                          name="price"
                          control={control}
                          render={({ field, fieldState }) => (
                            <FormControl isInvalid={!!fieldState.error}>
                              <FormLabel fontSize="sm" fontWeight="600" color="white" mb={2}>
                                Price
                              </FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents="none" h="46px" color="whiteAlpha.600">
                                  €
                                </InputLeftElement>
                                <Input
                                  value={field.value ?? ''}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                    field.onChange(val ? Number(val) : 0);
                                  }}
                                  onBlur={field.onBlur}
                                  placeholder="0.00"
                                  bg="#16151A"
                                  border="1px solid"
                                  borderColor="#29282D"
                                  color="white"
                                  h="46px"
                                  pl={10}
                                  borderRadius="xl"
                                  _hover={{ borderColor: 'whiteAlpha.350' }}
                                  _focus={{ borderColor: 'white', boxShadow: 'none' }}
                                />
                              </InputGroup>
                              {fieldState.error && (
                                <FormErrorMessage color="danger.primary">{fieldState.error.message}</FormErrorMessage>
                              )}
                            </FormControl>
                          )}
                        />

                        {/* Duration Input */}
                        <Controller
                          name="durationMinutes"
                          control={control}
                          render={({ field, fieldState }) => (
                            <FormControl isInvalid={!!fieldState.error}>
                              <FormLabel fontSize="sm" fontWeight="600" color="white" mb={2}>
                                Duration
                              </FormLabel>
                              <Select
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                bg="#16151A"
                                border="1px solid"
                                borderColor="#29282D"
                                color="white"
                                h="46px"
                                borderRadius="xl"
                                _hover={{ borderColor: 'whiteAlpha.350' }}
                                _focus={{ borderColor: 'white', boxShadow: 'none' }}
                                sx={{
                                  '& > option': {
                                    bg: '#16151A',
                                    color: 'white',
                                  },
                                }}
                              >
                                {SERVICE_DURATIONS.map((d) => (
                                  <option key={d.value} value={d.value}>
                                    {d.label}
                                  </option>
                                ))}
                              </Select>
                              {fieldState.error && (
                                <FormErrorMessage color="danger.primary">{fieldState.error.message}</FormErrorMessage>
                              )}
                            </FormControl>
                          )}
                        />

                      </SimpleGrid>

                      {/* Mock Buttons for Extra Time and Options */}
                      <HStack spacing={3} pt={2}>
                        <Button
                          variant="outline"
                          borderColor="whiteAlpha.300"
                          color="white"
                          borderRadius="full"
                          h="38px"
                          px={5}
                          fontSize="xs"
                          fontWeight="700"
                          _hover={{ bg: 'whiteAlpha.100' }}
                          leftIcon={
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          }
                        >
                          Add extra time
                        </Button>
                        <Button
                          variant="outline"
                          borderColor="whiteAlpha.300"
                          color="white"
                          borderRadius="full"
                          h="38px"
                          px={5}
                          fontSize="xs"
                          fontWeight="700"
                          _hover={{ bg: 'whiteAlpha.100' }}
                          rightIcon={
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          }
                        >
                          Options
                        </Button>
                      </HStack>

                    </VStack>
                  </Box>

                  {/* SECTION 3: Availability schedule */}
                  <Box>
                    <Heading fontSize="lg" fontWeight="700" color="white" mb={6} letterSpacing="-0.01em">
                      Availability schedule
                    </Heading>
                    <Box bg="#16151A" border="1px solid" borderColor="whiteAlpha.100" borderRadius="2xl" p={5}>
                      <Checkbox
                        isChecked={useAllDays}
                        onChange={(e) => setUseAllDays(e.target.checked)}
                        colorScheme="brand"
                        mb={4}
                        sx={{
                          '.chakra-checkbox__control': {
                            bg: '#16151A',
                            borderColor: 'whiteAlpha.350',
                            _checked: {
                              bg: 'brand.500',
                              borderColor: 'brand.500',
                            }
                          }
                        }}
                      >
                        <Text fontSize="sm" fontWeight="600" color="white">Available all open days</Text>
                      </Checkbox>

                      {!useAllDays && (
                        <MotionBox
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          pt={2}
                        >
                          <CheckboxGroup
                            value={selectedDays}
                            onChange={(values) => setSelectedDays(values as string[])}
                          >
                            <Wrap spacing={4}>
                              {DAYS_OF_WEEK.map((day) => {
                                const isOpen = openDays.includes(day);
                                return (
                                  <WrapItem key={day}>
                                    <Checkbox
                                      value={day}
                                      isDisabled={!isOpen}
                                      colorScheme="brand"
                                      size="md"
                                      sx={{
                                        '.chakra-checkbox__control': {
                                          bg: '#16151A',
                                          borderColor: 'whiteAlpha.300',
                                          _checked: {
                                            bg: 'brand.500',
                                            borderColor: 'brand.500',
                                          }
                                        }
                                      }}
                                    >
                                      <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        color={isOpen ? 'white' : 'whiteAlpha.400'}
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
                  </Box>

                </VStack>
            </Box>
          </form>
        </FormProvider>
      </Box>
    );
  }

  // STANDARD LIGHT-THEMED INLINE FORM RENDERER (Preserves onboarding unmodified!)
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
