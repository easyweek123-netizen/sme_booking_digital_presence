import { Button } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface SubmitButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  size?: 'sm' | 'md' | 'lg';
  w?: string | number;
}

export function SubmitButton({
  children,
  isLoading,
  loadingText,
  size = 'lg',
  w,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      colorScheme="brand"
      size={size}
      w={w}
      isLoading={isLoading}
      loadingText={loadingText}
      isDisabled={isLoading}
    >
      {children}
    </Button>
  );
}
