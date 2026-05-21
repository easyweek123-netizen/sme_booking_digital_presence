import { useState } from 'react';
import { VStack, Heading, Button, HStack } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { BUSINESS_PROFILE_FIELDS, BUSINESS_BRANDING_FIELDS, BUSINESS_ABOUT_FIELDS } from '@shared';
import { BusinessProfileFields } from '../Dashboard/BusinessProfileFields';
import { AboutContentFields } from '../Dashboard/AboutContentFields';
import { BrandingFields } from '../ui/BrandingFields';
import { WorkingHoursEditor } from '../onboarding/WorkingHoursEditor';
import { defaultWorkingHours } from '../../store/slices/onboardingSlice';
import type { WebsiteFormValues } from '../../pages/dashboard/websiteForm.types';
import type { WorkingHours } from '../../types';

interface BusinessUpdateProposalProps {
  initialValues: Record<string, unknown>;
  updatedFields: string[];
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function toWebsiteFormValues(initial: Record<string, unknown>): WebsiteFormValues {
  return {
    profile: {
      name: String(initial.name ?? ''),
      description: String(initial.description ?? ''),
      phone: String(initial.phone ?? ''),
      address: String(initial.address ?? ''),
      city: String(initial.city ?? ''),
      website: String(initial.website ?? ''),
      instagram: String(initial.instagram ?? ''),
    },
    branding: {
      logoUrl: String(initial.logoUrl ?? ''),
      brandColor: String(initial.brandColor ?? ''),
      coverImageUrl: String(initial.coverImageUrl ?? ''),
    },
    about: {
      aboutContent: String(initial.aboutContent ?? ''),
    },
    availability: [],
  };
}

export function BusinessUpdateProposal({
  initialValues,
  updatedFields,
  onSubmit,
  onCancel,
  isLoading = false,
}: BusinessUpdateProposalProps) {
  const form = useForm<WebsiteFormValues>({
    defaultValues: toWebsiteFormValues(initialValues),
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    () => (initialValues.workingHours as WorkingHours) ?? defaultWorkingHours,
  );

  const showProfile = updatedFields.some((f) => (BUSINESS_PROFILE_FIELDS as readonly string[]).includes(f));
  const showBranding = updatedFields.some((f) => (BUSINESS_BRANDING_FIELDS as readonly string[]).includes(f));
  const showAbout = updatedFields.some((f) => (BUSINESS_ABOUT_FIELDS as readonly string[]).includes(f));
  const showWorkingHours = updatedFields.includes('workingHours');

  const handleConfirm = () => {
    const values = form.getValues();
    const filtered: Record<string, unknown> = {};

    if (showProfile) {
      for (const [key, val] of Object.entries(values.profile)) {
        if (val !== '') filtered[key] = val;
      }
    }
    if (showBranding) {
      for (const [key, val] of Object.entries(values.branding)) {
        if (val !== '') filtered[key] = val;
      }
    }
    if (showAbout && values.about.aboutContent !== '') {
      filtered.aboutContent = values.about.aboutContent;
    }
    if (showWorkingHours) {
      filtered.workingHours = workingHours;
    }
    onSubmit(filtered);
  };

  return (
    <FormProvider {...form}>
      <VStack spacing={6} align="stretch">
        {showProfile && (
          <VStack spacing={3} align="stretch">
            <BusinessProfileFields />
          </VStack>
        )}

        {showBranding && (
          <VStack spacing={3} align="stretch">
            <Heading size="xs" color="text.secondary">
              Branding
            </Heading>
            <BrandingFields />
          </VStack>
        )}

        {showAbout && (
          <VStack spacing={3} align="stretch">
            <Heading size="xs" color="text.secondary">
              About Section
            </Heading>
            <AboutContentFields />
          </VStack>
        )}

        {showWorkingHours && (
          <VStack spacing={3} align="stretch">
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
          <Button isLoading={isLoading} colorScheme="brand" size="sm" onClick={handleConfirm}>
            Confirm
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
}
