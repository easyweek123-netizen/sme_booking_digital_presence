import { Box } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { ImageUploadField } from '../../ui/form';

interface PhotoUrlProps {
  name?: string;
  label?: string;
}

export function PhotoUrl({ name = 'photoUrl', label = 'Photo' }: PhotoUrlProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Box maxW={{ base: 'full', md: '320px' }}>
          <ImageUploadField
            label={label}
            folder="services"
            value={(field.value as string | null) ?? ''}
            onChange={(url) => field.onChange(url || null)}
            helperText="16:9 · PNG, JPG or WEBP up to 4 MB. Shown on the booking page card."
            urlPlaceholder="https://example.com/photo.jpg"
          />
        </Box>
      )}
    />
  );
}
