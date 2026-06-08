import { SimpleGrid, VStack } from '@chakra-ui/react';
import { DashboardSectionCard } from '../../DashboardSectionCard';
import { TextField, TextAreaField } from '../../../ui/form';
import { BrandingFields } from '../../../ui/BrandingFields';
import { GlobeIcon, InstagramIcon, TagIcon } from '../../../icons';
import { TEXT_LIMITS } from '../../../../constants';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';

export function Basic() {
  return (
    <DashboardSectionCard>
      <VStack spacing="space.stack.md" align="stretch">
        <TextField<WebsiteFormValues>
          name="basic.name"
          label="Business name"
          placeholder="Your business name"
          autoComplete="organization"
          leftAddon={<TagIcon size={16} />}
          isRequired
          size="lg"
        />

        <TextAreaField<WebsiteFormValues>
          name="basic.description"
          label="Tagline"
          labelSuffix="Shown beneath the name on your booking page"
          maxLength={TEXT_LIMITS.BUSINESS_TAGLINE}
          showCount
          rows={3}
        />

        <BrandingFields />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="space.stack.md">
          <TextField<WebsiteFormValues>
            name="basic.website"
            label="Website"
            optionalBadge
            placeholder="https://hanasato.at"
            type="url"
            autoComplete="url"
            leftAddon={<GlobeIcon size={16} />}
          />
          <TextField<WebsiteFormValues>
            name="basic.instagram"
            label="Instagram"
            optionalBadge
            placeholder="@yourbusiness"
            autoComplete="off"
            leftAddon={<InstagramIcon size={16} />}
          />
        </SimpleGrid>
      </VStack>
    </DashboardSectionCard>
  );
}
