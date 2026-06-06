import { Button, type ButtonProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { TrashIcon } from '../../../icons';
import type { ImageField } from './types';

export interface RemoveButtonProps extends Omit<ButtonProps, 'onClick'> {
  field: ImageField;
  children?: ReactNode;
}

export function RemoveButton({ field, children = 'Remove', ...rest }: RemoveButtonProps) {
  if (!field.hasImage) return null;
  return (
    <Button leftIcon={<TrashIcon size={14} />} size="sm" variant="ghost" onClick={field.clear} {...rest}>
      {children}
    </Button>
  );
}
