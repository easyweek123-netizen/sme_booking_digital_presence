import { Button, type ButtonProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { UploadIcon } from '../../../icons';
import type { ImageField } from './types';

export interface UploadButtonProps
  extends Omit<ButtonProps, 'onClick' | 'isLoading' | 'loadingText' | 'as' | 'htmlFor'> {
  field: ImageField;
  /** Override the auto-derived label. Defaults to "Upload" when empty, "Replace" when filled. */
  children?: ReactNode;
}

export function UploadButton({ field, children, ...rest }: UploadButtonProps) {
  const label = children ?? (field.hasImage ? 'Replace' : 'Upload');
  return (
    <Button
      as="label"
      htmlFor={field.inputId}
      leftIcon={<UploadIcon size={16} />}
      size="sm"
      variant="ghost"
      isLoading={field.isUploading}
      loadingText="Uploading"
      cursor="pointer"
      {...rest}
    >
      {label}
    </Button>
  );
}
