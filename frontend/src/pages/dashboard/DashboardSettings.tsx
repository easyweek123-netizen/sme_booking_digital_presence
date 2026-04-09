import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Spinner,
  Center,
  Flex,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  useGetMyBusinessQuery,
  useUpdateBusinessMutation,
} from '../../store/api/businessApi';
import { WorkingHoursEditor } from '../../components/onboarding/WorkingHoursEditor';
import { BrandingFields } from '../../components/ui/BrandingFields';
import { BusinessProfileFields } from '../../components/Dashboard/BusinessProfileFields';
import { AboutContentFields } from '../../components/Dashboard/AboutContentFields';
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
    coverImageUrl: '',
    aboutContent: '',
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
        coverImageUrl: business.coverImageUrl || '',
        aboutContent: business.aboutContent || '',
      });
      setWorkingHours(business.workingHours);
    }
  }, [business]);

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
      <Box>
        <Heading size="lg" color="gray.900" mb={1}>
          Settings
        </Heading>
        <Text color="gray.500">Update your business profile</Text>
      </Box>

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
          coverImageUrl={formData.coverImageUrl}
          onCoverImageUrlChange={(url) => {
            setFormData((prev) => ({ ...prev, coverImageUrl: url }));
            setHasChanges(true);
          }}
        />
      </Box>

      {/* About Section */}
      <Box bg="white" borderRadius="xl" border="1px" borderColor="gray.100" p={6}>
        <Heading size="sm" color="gray.900" mb={2}>
          About Section
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Tell your story. This appears in the &ldquo;About&rdquo; tab on your booking page.
        </Text>
        <AboutContentFields
          value={formData.aboutContent}
          onChange={(val) => {
            setFormData((prev) => ({ ...prev, aboutContent: val }));
            setHasChanges(true);
          }}
          brandColor={formData.brandColor}
          businessName={formData.name}
        />
      </Box>

      {/* Business Profile */}
      <Box bg="white" borderRadius="xl" border="1px" borderColor="gray.100" p={6}>
        <Heading size="sm" color="gray.900" mb={4}>
          Business Profile
        </Heading>
        <BusinessProfileFields
          values={formData}
          onChange={(name, value) => {
            setFormData((prev) => ({ ...prev, [name]: value }));
            setHasChanges(true);
          }}
        />
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

