import { Controller, useFormContext } from 'react-hook-form';
import { Box, useToken } from '@chakra-ui/react';
import { ColorField, ImageUploadField } from '../../../ui/form';
import { BusinessLocationPicker, emptyDraftForType } from '../../../Locations';
import { BRAND_COLOR_PRESETS } from '../../../../constants';

export function RhfColorField({ name, label }: { name: string; label: string }) {
  const { control } = useFormContext();
  const presetHexes = useToken('colors', [...BRAND_COLOR_PRESETS]);
  return <Controller control={control} name={name} render={({ field }) => (
    <ColorField 
      label={label} 
      value={field.value || presetHexes[0]} 
      onChange={field.onChange}
      presets={presetHexes} 
      allowCustom 
      showCheckmark />)} 
    />;
}
export function RhfImageField({ name, label, aspectRatio }: { name: string; label: string; aspectRatio: number }) {
  const { control } = useFormContext();
  return  <Controller control={control} name={name} render={({ field }) => (
      <ImageUploadField 
        label={label} 
        folder="business" 
        aspectRatio={aspectRatio}
        value={field.value ?? ''} 
        onChange={field.onChange} />)} 
      />;
}
export function RhfLocationField({ name, type }: { name: string; type: 'ADDRESS' | 'PHONE' }) {
  const { control } = useFormContext();
  return <Controller control={control} name={name} render={({ field }) => (
    <BusinessLocationPicker 
      type={type} 
      value={field.value ?? emptyDraftForType(type)} 
      onChange={field.onChange} />)} 
    />;
}