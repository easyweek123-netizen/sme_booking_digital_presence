import { IMAGE_ACCEPT } from '../../../../lib/useImageUpload';
import type { ImageField } from './types';

export function HiddenInput({ field }: { field: ImageField }) {
  const { inputId, handleFile } = field;
  return (
    <input
      id={inputId}
      type="file"
      accept={IMAGE_ACCEPT}
      style={{ display: 'none' }}
      onChange={(e) => {
        handleFile(e.target.files?.[0]);
        e.target.value = '';
      }}
    />
  );
}
