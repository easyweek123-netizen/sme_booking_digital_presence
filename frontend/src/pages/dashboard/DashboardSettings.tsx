import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  SimpleGrid,
  useToast,
  Spinner,
  Center,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  useGetMyBusinessQuery,
  useUpdateBusinessMutation,
} from '../../store/api/businessApi';
import { WorkingHoursEditor } from '../../components/onboarding/WorkingHoursEditor';
import { BrandingFields } from '../../components/ui/BrandingFields';
import { BookingLinkCard } from '../../components/QRCode';
import { TOAST_DURATION } from '../../constants';
import type { WorkingHours } from '../../types';

export function DashboardSettings() {
  const toast = useToast();
  const { data: business, isLoading } = useGetMyBusinessQuery();
  const [updateBusiness, { isLoading: isUpdating }] = useUpdateBusinessMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    city: '',
    website: '',
    instagram: '',
    logoUrl: '',
    brandColor: '',
  });
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with business data
  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        description: business.description || '',
        phone: business.phone || '',
        address: business.address || '',
        city: business.city || '',
        website: business.website || '',
        instagram: business.instagram || '',
        logoUrl: business.logoUrl || '',
        brandColor: business.brandColor || '',
      });
      setWorkingHours(business.workingHours);
    }
  }, [business]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleWorkingHoursChange = (hours: WorkingHours) => {
    setWorkingHours(hours);
    setHasChanges(true);
  };

  const handleLogoUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, logoUrl: url }));
    setHasChanges(true);
  };

  const handleBrandColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, brandColor: color }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!business) return;

    try {
      await updateBusiness({
        id: business.id,
        data: {
          ...formData,
          workingHours: workingHours || undefined,
        },
      }).unwrap();

      toast({
        title: 'Settings saved',
        status: 'success',
        duration: TOAST_DURATION.MEDIUM,
      });
      setHasChanges(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Could not save settings. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  if (isLoading || !business) {
    return (
      <Center py={12}>
        <Spinner size="lg" color="brand.500" />
      </Center>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="lg" color="gray.900" mb={1}>
            Settings
          </Heading>
          <Text color="gray.500">Update your business profile</Text>
        </Box>
        <Button
          colorScheme="brand"
          onClick={handleSave}
          isLoading={isUpdating}
          isDisabled={!hasChanges}
        >
          Save Changes
        </Button>
      </Flex>

      {/* Booking Link */}
      <Box>
        <Heading size="sm" color="gray.900" mb={4}>
          Your Booking Link
        </Heading>
        <BookingLinkCard slug={business.slug} />
      </Box>

      {/* Branding */}
      <Box bg="white" borderRadius="xl" border="1px" borderColor="gray.100" p={6}>
        <Heading size="sm" color="gray.900" mb={4}>
          Branding
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Customize your booking page with your logo and brand color
        </Text>
        <BrandingFields
          logoUrl={formData.logoUrl}
          brandColor={formData.brandColor}
          onLogoUrlChange={handleLogoUrlChange}
          onBrandColorChange={handleBrandColorChange}
        />
      </Box>

      {/* Business Profile */}
      <Box bg="white" borderRadius="xl" border="1px" borderColor="gray.100" p={6}>
        <Heading size="sm" color="gray.900" mb={4}>
          Business Profile
        </Heading>

        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500">
              Business Name
            </FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your business name"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500">
              Description
            </FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell customers about your business"
              rows={3}
            />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">
                Phone
              </FormLabel>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">
                City
              </FormLabel>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="New York"
              />
            </FormControl>
          </SimpleGrid>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500">
              Address
            </FormLabel>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main St"
            />
          </FormControl>

          <Divider />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">
                Website
              </FormLabel>
              <Input
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500">
                Instagram
              </FormLabel>
              <Input
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="@yourbusiness"
              />
            </FormControl>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Working Hours */}
      <Box bg="white" borderRadius="xl" border="1px" borderColor="gray.100" p={6}>
        <Heading size="sm" color="gray.900" mb={4}>
          Working Hours
        </Heading>
        {workingHours && (
          <WorkingHoursEditor
            value={workingHours}
            onChange={handleWorkingHoursChange}
          />
        )}
      </Box>

      {/* Save Button (bottom) */}
      <Flex justify="flex-end">
        <Button
          colorScheme="brand"
          size="lg"
          onClick={handleSave}
          isLoading={isUpdating}
          isDisabled={!hasChanges}
        >
          Save Changes
        </Button>
      </Flex>
    </VStack>
  );
}

