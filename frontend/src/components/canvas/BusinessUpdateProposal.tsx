import { VStack, Heading, Button, HStack } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import { BUSINESS_BASIC_FIELDS, BUSINESS_ABOUT_FIELDS } from '@shared';
import { BasicTab } from '../Dashboard/website/BasicTab';
import { AboutContentFields } from '../Dashboard/AboutContentFields';
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
    basic: {
      name: String(initial.name ?? ''),
      description: String(initial.description ?? ''),
      logoUrl: String(initial.logoUrl ?? ''),
      brandColor: String(initial.brandColor ?? ''),
      coverImageUrl: String(initial.coverImageUrl ?? ''),
      website: String(initial.website ?? ''),
      instagram: String(initial.instagram ?? ''),
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

  const showBasic = updatedFields.some((f) =>
    (BUSINESS_BASIC_FIELDS as readonly string[]).includes(f),
  );
  const showAbout = updatedFields.some((f) =>
    (BUSINESS_ABOUT_FIELDS as readonly string[]).includes(f),
  );
  const showWorkingHours = updatedFields.includes('workingHours');

  const handleConfirm = () => {
    const values = form.getValues();
    const filtered: Record<string, unknown> = {};

    if (showBasic) {
      for (const [key, val] of Object.entries(values.basic)) {
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
        {showBasic && (
          <VStack spacing={3} align="stretch">
            <Heading size="xs" color="text.secondary">
              Business basics
            </Heading>
            <BasicTab />
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