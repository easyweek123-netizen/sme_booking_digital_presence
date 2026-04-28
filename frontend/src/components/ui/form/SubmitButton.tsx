import { Button, type ButtonProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type SubmitButtonProps = Omit<ButtonProps, 'type'> & {
  children: ReactNode;
  loadingText?: string;
};

export function SubmitButton({
  children,
  isLoading,
  loadingText,
  size = 'lg',
  isDisabled,
  ...rest
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      colorScheme="brand"
      size={size}
      isLoading={isLoading}
      loadingText={loadingText}
      isDisabled={isLoading || isDisabled}
      {...rest}
    >
      {children}
    </Button>
  );
}
