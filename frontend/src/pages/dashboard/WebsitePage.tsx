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
import { useState, useEffect, useCallback } from 'react';
import {
  useGetMyBusinessQuery,
  useUpdateBusinessMutation,
} from '../../store/api/businessApi';
import { WorkingHoursEditor } from '../../components/onboarding/WorkingHoursEditor';
import { BrandingFields } from '../../components/ui/BrandingFields';
import {
  AboutContentFields,
  BusinessProfileFields,
  WebsiteCompletionProgress,
} from '../../components/Dashboard';
import { BookingLinkCard } from '../../components/QRCode';
import { TOAST_DURATION } from '../../constants';
import type { WorkingHours } from '../../types';

export function WebsitePage() {
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

  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

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
        title: 'Website saved',
        status: 'success',
        duration: TOAST_DURATION.MEDIUM,
      });
      setHasChanges(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Could not save changes. Please try again.',
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

  const sectionCardProps = {
    bg: 'white' as const,
    borderRadius: 'xl' as const,
    border: '1px solid' as const,
    borderColor: 'gray.100' as const,
    p: 6,
  };

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading size="lg" color="gray.900" mb={1}>
          Website
        </Heading>
        <Text color="gray.500">Build and customize your booking page</Text>
      </Box>

      <WebsiteCompletionProgress
        business={business}
        onScrollToSection={scrollToSection}
      />

      <Box id="section-booking-link">
        <Heading size="sm" color="gray.900" mb={1}>
          Your booking link
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Share this link or QR code so customers can book online.
        </Text>
        <Box {...sectionCardProps}>
          <BookingLinkCard slug={business.slug} />
        </Box>
      </Box>

      <Box id="section-business-profile">
        <Heading size="sm" color="gray.900" mb={1}>
          Business profile
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Name, description, and contact details shown on your booking page.
        </Text>
        <Box {...sectionCardProps}>
          <BusinessProfileFields
            values={formData}
            onChange={(name, value) => {
              setFormData((prev) => ({ ...prev, [name]: value }));
              setHasChanges(true);
            }}
          />
        </Box>
      </Box>

      <Box id="section-branding">
        <Heading size="sm" color="gray.900" mb={1}>
          Branding
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Logo, brand color, and cover image for a polished booking page.
        </Text>
        <Box {...sectionCardProps}>
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
      </Box>

      <Box id="section-working-hours">
        <Heading size="sm" color="gray.900" mb={1}>
          Working hours
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          When customers can book with you.
        </Text>
        <Box {...sectionCardProps}>
          {workingHours && (
            <WorkingHoursEditor
              value={workingHours}
              onChange={handleWorkingHoursChange}
            />
          )}
        </Box>
      </Box>

      <Box id="section-about">
        <Heading size="sm" color="gray.900" mb={1}>
          About section
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Tell your story. This appears in the About tab on your booking page.
        </Text>
        <Box {...sectionCardProps}>
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
      </Box>

      <Flex justify="flex-end">
        <Button
          colorScheme="brand"
          size="lg"
          onClick={handleSave}
          isLoading={isUpdating}
          isDisabled={!hasChanges}
        >
          Save changes
        </Button>
      </Flex>
    </VStack>
  );
}
