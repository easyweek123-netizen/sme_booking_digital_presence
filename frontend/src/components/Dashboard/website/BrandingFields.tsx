import { Box, SimpleGrid, VStack, useToken } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { ColorField } from '../../ui/form/ColorField';
import { ImageUploadField } from '../../ui/form/ImageUploadField';
import { BRAND_COLOR_PRESETS } from '../../../constants';
import type { WebsiteFormValues } from '../../../pages/dashboard/websiteForm.types';

export function BrandingFields() {
  const { control, watch, setValue } = useFormContext<WebsiteFormValues>();
  const logoUrl = watch('basic.logoUrl');
  const coverImageUrl = watch('basic.coverImageUrl');
  const presetHexes = useToken('colors', [...BRAND_COLOR_PRESETS]);

  return (
    <VStack spacing="space.stack.md" align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="space.stack.md" alignItems="start">
        <Box maxW={{ base: '52', md: '180px' }}>
          <ImageUploadField
            label="Logo"
            folder="business"
            value={logoUrl ?? ''}
            onChange={(url) => setValue('basic.logoUrl', url, { shouldDirty: true })}
            helperText="Square · PNG/SVG · under 2 MB. Recommended 512 × 512."
            aspectRatio={1}
            urlPlaceholder="https://example.com/your-logo.png"
          />
        </Box>

        <Controller
          control={control}
          name="basic.brandColor"
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
      </SimpleGrid>

      <Box maxW={{ base: 'full', md: '320px' }}>
        <ImageUploadField
          label="Cover image"
          folder="business"
          value={coverImageUrl ?? ''}
          onChange={(url) => setValue('basic.coverImageUrl', url, { shouldDirty: true })}
          helperText="16:9 · under 4 MB. Leave empty to use a gradient based on your brand color."
          urlPlaceholder="https://example.com/cover-image.jpg"
        />
      </Box>
    </VStack>
  );
}
