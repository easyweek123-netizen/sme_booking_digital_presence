import { Button, type ButtonProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { UploadIcon } from '../../../icons';
import type { ImageField } from './types';

export interface UploadButtonProps extends Omit<ButtonProps, 'onClick' | 'isLoading' | 'loadingText'> {
  field: ImageField;
  /** Override the auto-derived label. Defaults to "Upload" when empty, "Replace" when filled. */
  children?: ReactNode;
}

export function UploadButton({ field, children, ...rest }: UploadButtonProps) {
  const label = children ?? (field.hasImage ? 'Replace' : 'Upload');

  return (
    <Button
      leftIcon={<UploadIcon size={16} />}
      size="sm"
      variant="ghost"
      onClick={field.openPicker}
      isLoading={field.isUploading}
      loadingText="Uploading"
      {...rest}
    >
      {label}
    </Button>
  );
}
