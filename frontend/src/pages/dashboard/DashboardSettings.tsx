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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormHelperText,
} from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
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

  // Sanitize HTML for preview
  const sanitizedAboutContent = useMemo(() => {
    if (!formData.aboutContent) return '';
    return DOMPurify.sanitize(formData.aboutContent, {
      ALLOWED_TAGS: ['h2', 'h3', 'h4', 'p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'blockquote', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }, [formData.aboutContent]);

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

        <Divider my={6} />

        {/* Cover Image */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="500">
            Cover Image URL
          </FormLabel>
          <Input
            name="coverImageUrl"
            type="url"
            value={formData.coverImageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/cover-image.jpg"
          />
          <FormHelperText>
            Add a cover image for your booking page header. Leave empty to use a gradient based on your brand color.
          </FormHelperText>
        </FormControl>

        {/* Cover Image Preview */}
        {formData.coverImageUrl && (
          <Box
            mt={4}
            h="120px"
            borderRadius="lg"
            overflow="hidden"
            bg="gray.100"
            bgImage={`url(${formData.coverImageUrl})`}
            bgSize="cover"
            bgPosition="center"
          />
        )}
      </Box>

      {/* About Section */}
      <Box bg="white" borderRadius="xl" border="1px" borderColor="gray.100" p={6}>
        <Heading size="sm" color="gray.900" mb={2}>
          About Section
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Tell your story. This appears in the "About" tab on your booking page.
        </Text>

        <Tabs variant="enclosed" size="sm">
          <TabList>
            <Tab>Edit</Tab>
            <Tab>Preview</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <FormControl>
                <Textarea
                  name="aboutContent"
                  value={formData.aboutContent}
                  onChange={handleInputChange}
                  placeholder={`<h2>Welcome to ${formData.name || 'Your Business'}</h2>

<p>Write your story here...</p>

<h3>What We Offer</h3>
<ul>
  <li>Service 1</li>
  <li>Service 2</li>
</ul>

<blockquote>
  "Customer testimonial here"
</blockquote>`}
                  rows={12}
                  fontFamily="mono"
                  fontSize="sm"
                />
                <FormHelperText>
                  Supports HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;blockquote&gt;, &lt;a&gt;
                </FormHelperText>
              </FormControl>
            </TabPanel>
            <TabPanel px={0}>
              <Box
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="lg"
                minH="200px"
                sx={{
                  '& h2': { fontSize: 'xl', fontWeight: '700', color: 'gray.900', mb: 3, mt: 4, _first: { mt: 0 } },
                  '& h3': { fontSize: 'lg', fontWeight: '600', color: 'gray.800', mb: 2, mt: 4 },
                  '& h4': { fontSize: 'md', fontWeight: '600', color: 'gray.700', mb: 2, mt: 3 },
                  '& p': { fontSize: 'md', color: 'gray.600', lineHeight: '1.7', mb: 3, _last: { mb: 0 } },
                  '& ul, & ol': { pl: 5, mb: 3, color: 'gray.600' },
                  '& li': { mb: 1, lineHeight: '1.6' },
                  '& blockquote': { 
                    borderLeftWidth: '3px', 
                    borderLeftColor: formData.brandColor || 'brand.500', 
                    pl: 4, py: 2, my: 4, 
                    bg: 'gray.50', 
                    borderRadius: 'md', 
                    fontStyle: 'italic', 
                    color: 'gray.600' 
                  },
                  '& a': { color: formData.brandColor || 'brand.600', textDecoration: 'underline' },
                  '& strong, & b': { fontWeight: '600', color: 'gray.800' },
                  '& em, & i': { fontStyle: 'italic' },
                }}
              >
                {sanitizedAboutContent ? (
                  <Box dangerouslySetInnerHTML={{ __html: sanitizedAboutContent }} />
                ) : (
                  <Text color="gray.400" fontStyle="italic">
                    Enter content in the Edit tab to see a preview...
                  </Text>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
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

