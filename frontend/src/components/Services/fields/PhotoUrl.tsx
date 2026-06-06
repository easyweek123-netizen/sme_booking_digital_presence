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
        <ImageUploadField
          label={label}
          folder="services"
          value={(field.value as string | null) ?? ''}
          onChange={(url) => field.onChange(url || null)}
          previewVariant="cover"
          placeholder="https://example.com/photo.jpg"
          helperText="PNG, JPG, or WEBP up to 4MB"
          clearAriaLabel="Clear photo"
        />
      )}
    />
  );
}
