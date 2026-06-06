import { Input } from '@chakra-ui/react';
import { IMAGE_ACCEPT } from '../../../../lib/useImageUpload';
import type { ImageField } from './types';

export function HiddenInput({ field }: { field: ImageField }) {
  const { fileInputRef, handleFile } = field;

  return (
    <Input
      ref={fileInputRef}
      type="file"
      accept={IMAGE_ACCEPT}
      display="none"
      onChange={(e) => {
        handleFile(e.target.files?.[0]);
        e.target.value = '';
      }}
    />
  );
}
