import { Button, type ButtonProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { UploadIcon } from '../../../icons';
import type { ImageField } from './types';

export interface UploadButtonProps extends Omit<ButtonProps, 'onClick' | 'isLoading' | 'loadingText'> {
  field: ImageField;
  children?: ReactNode;
}

export function UploadButton({ field, children = 'Upload', ...rest }: UploadButtonProps) {
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
      {children}
    </Button>
  );
}
