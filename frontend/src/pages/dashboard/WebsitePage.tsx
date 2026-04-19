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
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  useGetMyBusinessQuery,
  useUpdateBusinessMutation,
} from '../../store/api/businessApi';
import { WorkingHoursEditor } from '../../components/onboarding/WorkingHoursEditor';
import { BrandingFields } from '../../components/ui/BrandingFields';
import {
  AboutContentFields,
  BusinessProfileFields,
} from '../../components/Dashboard';
import { BookingLinkCard } from '../../components/QRCode';
import { CheckIcon } from '../../components/icons';
import { TOAST_DURATION } from '../../constants';
import type { WorkingHours } from '../../types';

type TabKey = 'profile' | 'branding' | 'hours' | 'about';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'branding', label: 'Branding' },
  { key: 'hours', label: 'Hours' },
  { key: 'about', label: 'About' },
];

function filled(v?: string | null): boolean {
  return !!(v && String(v).trim());
}

export function WebsitePage() {
  const toast = useToast();
  const { data: business, isLoading } = useGetMyBusinessQuery();
  const [updateBusiness, { isLoading: isUpdating }] = useUpdateBusinessMutation();

  const [activeTab, setActiveTab] = useState<TabKey>('profile');

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

  const tabStatus = {
    profile: {
      done: [
        formData.name,
        formData.description,
        formData.phone,
        formData.address,
        formData.city,
      ].filter(filled).length,
      total: 5,
    },
    branding: {
      done: [formData.logoUrl, formData.brandColor, formData.coverImageUrl].filter(filled).length,
      total: 3,
    },
    hours: { done: workingHours ? 1 : 0, total: 1 },
    about: { done: filled(formData.aboutContent) ? 1 : 0, total: 1 },
  };

  const isComplete = (k: TabKey) => tabStatus[k].done === tabStatus[k].total;

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

      <Box>
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

      <Box>
        <Breadcrumb separator=">" spacing={3} fontWeight="medium" fontSize="md">
          {TABS.map((t) => {
            const isActive = activeTab === t.key;
            const complete = isComplete(t.key);
            const { done, total } = tabStatus[t.key];
            return (
              <BreadcrumbItem key={t.key} isCurrentPage={isActive}>
                <BreadcrumbLink
                  as="button"
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  color={isActive ? 'brand.600' : 'gray.500'}
                  fontWeight={isActive ? '600' : '500'}
                  textDecoration="none"
                  _hover={{ color: 'brand.600', textDecoration: 'none' }}
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: 'brand.500',
                    outlineOffset: '2px',
                    borderRadius: 'sm',
                  }}
                >
                  <HStack spacing={1}>
                    <Text>{t.label}</Text>
                    {complete ? (
                      <Box color="brand.500" aria-label="complete" display="inline-flex">
                        <CheckIcon size={14} />
                      </Box>
                    ) : done > 0 ? (
                      <Text as="span" fontSize="xs" color="gray.400">
                        {done}/{total}
                      </Text>
                    ) : null}
                  </HStack>
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>

        <Box mt={4} {...sectionCardProps}>
          {activeTab === 'profile' && (
            <BusinessProfileFields
              values={formData}
              onChange={(name, value) => {
                setFormData((prev) => ({ ...prev, [name]: value }));
                setHasChanges(true);
              }}
            />
          )}
          {activeTab === 'branding' && (
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
          )}
          {activeTab === 'hours' && workingHours && (
            <WorkingHoursEditor value={workingHours} onChange={handleWorkingHoursChange} />
          )}
          {activeTab === 'hours' && !workingHours && (
            <Text color="gray.500" fontSize="sm">
              Working hours are not configured yet.
            </Text>
          )}
          {activeTab === 'about' && (
            <AboutContentFields
              value={formData.aboutContent}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, aboutContent: val }));
                setHasChanges(true);
              }}
              brandColor={formData.brandColor}
              businessName={formData.name}
            />
          )}
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
