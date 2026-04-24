import { useState } from 'react';
import { VStack, Heading, Button, HStack } from '@chakra-ui/react';
import { BUSINESS_PROFILE_FIELDS, BUSINESS_BRANDING_FIELDS, BUSINESS_ABOUT_FIELDS } from '@shared';
import { BusinessProfileFields } from '../Dashboard/BusinessProfileFields';
import { AboutContentFields } from '../Dashboard/AboutContentFields';
import { BrandingFields } from '../ui/BrandingFields';
import { WorkingHoursEditor } from '../onboarding/WorkingHoursEditor';
import { defaultWorkingHours } from '../../store/slices/onboardingSlice';
import type { WorkingHours } from '../../types';

interface BusinessUpdateProposalProps {
  initialValues: Record<string, unknown>;
  updatedFields: string[];
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BusinessUpdateProposal({
  initialValues,
  updatedFields,
  onSubmit,
  onCancel,
  isLoading = false,
}: BusinessUpdateProposalProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const merged: Record<string, string> = {};
    for (const key of [...BUSINESS_PROFILE_FIELDS, ...BUSINESS_BRANDING_FIELDS, ...BUSINESS_ABOUT_FIELDS]) {
      merged[key] = String(initialValues[key] ?? '');
    }
    return merged;
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    () => (initialValues.workingHours as WorkingHours) ?? defaultWorkingHours,
  );

  const showProfile = updatedFields.some((f) => (BUSINESS_PROFILE_FIELDS as readonly string[]).includes(f));
  const showBranding = updatedFields.some((f) => (BUSINESS_BRANDING_FIELDS as readonly string[]).includes(f));
  const showAbout = updatedFields.some((f) => (BUSINESS_ABOUT_FIELDS as readonly string[]).includes(f));
  const showWorkingHours = updatedFields.includes('workingHours');

  const handleFieldChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <VStack spacing={6} align="stretch">
      {showProfile && (
        <VStack spacing={3} align="stretch">
          <Heading size="xs" color="text.secondary">
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
          <Heading size="xs" color="text.secondary">
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
          <Heading size="xs" color="text.secondary">
            About Section
          </Heading>
          <AboutContentFields
            value={values.aboutContent}
            onChange={(val) => handleFieldChange('aboutContent', val)}
            brandColor={values.brandColor}
          />
        </VStack>
      )}

      {showWorkingHours && (
        <VStack spacing={3} align="stretch">
          <Heading size="xs" color="text.secondary">
            Working Hours
          </Heading>
          <WorkingHoursEditor
            value={workingHours}
            onChange={setWorkingHours}
            defaultExpanded={true}
          />
        </VStack>
      )}

      <HStack spacing={3} justify="flex-end" pt={2}>
        <Button variant="ghost" size="sm" onClick={onCancel} isDisabled={isLoading}>
          Cancel
        </Button>
        <Button isLoading={isLoading} colorScheme="brand" size="sm" onClick={() => {
          const filtered: Record<string, unknown> = {};
          for (const [key, val] of Object.entries(values)) {
            if (val !== '') {
              filtered[key] = val;
            }
          }
          if (showWorkingHours) {
            filtered.workingHours = workingHours;
          }
          onSubmit(filtered);
        }}>
          Confirm
        </Button>
      </HStack>
    </VStack>
  );
}
