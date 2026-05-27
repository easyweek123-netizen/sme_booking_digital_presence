import { SimpleGrid, VStack, useToken } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ColorField } from './form/ColorField';
import { ImageUrlField } from './form/ImageUrlField';
import { BRAND_COLOR_PRESETS } from '../../constants';
import type { WebsiteFormValues } from '../../pages/dashboard/websiteForm.types';

export function BrandingFields() {
  const { control, watch, setValue } = useFormContext<WebsiteFormValues>();
  const logoUrl = watch('branding.logoUrl');
  const coverImageUrl = watch('branding.coverImageUrl');
  const brandColor = watch('branding.brandColor');
  const presetHexes = useToken('colors', [...BRAND_COLOR_PRESETS]);

  // Seed default brand color so an unchanged form still submits a valid hex.
  // shouldDirty:false keeps the Save button accurate (no spurious enable).
  useEffect(() => {
    if (!brandColor && presetHexes[0]) {
      setValue('branding.brandColor', presetHexes[0], { shouldDirty: false });
    }
  }, [brandColor, presetHexes, setValue]);

  return (
    <VStack spacing="space.stack.lg" align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="space.stack.md">
        <ImageUrlField
          label="Logo"
          value={logoUrl ?? ''}
          onChange={(url) => setValue('branding.logoUrl', url, { shouldDirty: true })}
          placeholder="https://example.com/your-logo.png"
          helperText="Paste a URL to your logo. Square images look best."
          previewVariant="square"
          clearAriaLabel="Clear logo"
        />
        <ImageUrlField
          label="Cover image"
          value={coverImageUrl ?? ''}
          onChange={(url) => setValue('branding.coverImageUrl', url, { shouldDirty: true })}
          placeholder="https://example.com/cover-image.jpg"
          helperText="Add a cover image for your booking page header. Leave empty to use a gradient based on your brand color."
          previewVariant="banner"
          clearAriaLabel="Clear cover image"
        />
      </SimpleGrid>

      <Controller
        control={control}
        name="branding.brandColor"
        render={({ field }) => (
          <ColorField
            label="Brand color"
            value={field.value || presetHexes[0]}
            onChange={(c) => field.onChange(c)}
            presets={presetHexes}
            allowCustom
            showCheckmark
          />
        )}
      />
    </VStack>
  );
}
