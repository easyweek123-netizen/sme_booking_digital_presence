import { useState } from 'react';
import { VStack, Heading, Button, HStack } from '@chakra-ui/react';
import { BUSINESS_PROFILE_FIELDS, BUSINESS_BRANDING_FIELDS, BUSINESS_ABOUT_FIELDS } from '@shared';
import { BusinessProfileFields } from '../Dashboard/BusinessProfileFields';
import { AboutContentFields } from '../Dashboard/AboutContentFields';
import { BrandingFields } from '../ui/BrandingFields';

interface BusinessUpdateProposalProps {
  initialValues: Record<string, string>;
  updatedFields: string[];
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
}

export function BusinessUpdateProposal({
  initialValues,
  updatedFields,
  onSubmit,
  onCancel,
}: BusinessUpdateProposalProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const merged: Record<string, string> = {};
    for (const key of [...BUSINESS_PROFILE_FIELDS, ...BUSINESS_BRANDING_FIELDS, ...BUSINESS_ABOUT_FIELDS]) {
      merged[key] = String(initialValues[key] ?? '');
    }
    return merged;
  });

  const showProfile = updatedFields.some((f) => (BUSINESS_PROFILE_FIELDS as readonly string[]).includes(f));
  const showBranding = updatedFields.some((f) => (BUSINESS_BRANDING_FIELDS as readonly string[]).includes(f));
  const showAbout = updatedFields.some((f) => (BUSINESS_ABOUT_FIELDS as readonly string[]).includes(f));

  const handleFieldChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <VStack spacing={6} align="stretch">
      {showProfile && (
        <VStack spacing={3} align="stretch">
          <Heading size="xs" color="gray.600">
            Business Profile
          </Heading>
          <BusinessProfileFields
            values={{
              name: values.name,
              description: values.description,
              phone: values.phone,
              address: values.address,
              city: values.city,
              website: values.website,
              instagram: values.instagram,
            }}
            onChange={handleFieldChange}
          />
        </VStack>
      )}

      {showBranding && (
        <VStack spacing={3} align="stretch">
          <Heading size="xs" color="gray.600">
            Branding
          </Heading>
          <BrandingFields
            logoUrl={values.logoUrl}
            brandColor={values.brandColor}
            onLogoUrlChange={(url) => handleFieldChange('logoUrl', url)}
            onBrandColorChange={(color) => handleFieldChange('brandColor', color)}
            coverImageUrl={values.coverImageUrl}
            onCoverImageUrlChange={(url) => handleFieldChange('coverImageUrl', url)}
          />
        </VStack>
      )}

      {showAbout && (
        <VStack spacing={3} align="stretch">
          <Heading size="xs" color="gray.600">
            About Section
          </Heading>
          <AboutContentFields
            value={values.aboutContent}
            onChange={(val) => handleFieldChange('aboutContent', val)}
            brandColor={values.brandColor}
          />
        </VStack>
      )}

      <HStack spacing={3} justify="flex-end" pt={2}>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button colorScheme="brand" size="sm" onClick={() => {
          // Only send fields that have actual values — avoid sending empty strings
          // that trigger backend validation (e.g., brandColor must be valid hex)
          const filtered: Record<string, string> = {};
          for (const [key, val] of Object.entries(values)) {
            if (val !== '') {
              filtered[key] = val;
            }
          }
          onSubmit(filtered);
        }}>
          Confirm
        </Button>
      </HStack>
    </VStack>
  );
}
