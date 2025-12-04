import { Button, type ButtonProps } from '@chakra-ui/react';
import { ArrowRightIcon } from '../icons';

type ButtonVariant = 'default' | 'light';

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: ButtonVariant;
  showArrow?: boolean;
  children: React.ReactNode;
}

export function PrimaryButton({
  variant = 'default',
  showArrow = true,
  children,
  ...props
}: PrimaryButtonProps) {
  const isLight = variant === 'light';

  return (
    <Button
      bg={isLight ? 'white' : 'brand.500'}
      color={isLight ? 'gray.900' : 'white'}
      fontWeight="600"
      px={props.size === 'lg' ? 8 : 6}
      _hover={{
        bg: isLight ? 'gray.100' : 'brand.600',
        transform: 'translateY(-2px)',
      }}
      _active={{
        bg: isLight ? 'gray.200' : 'brand.700',
        transform: 'translateY(0)',
      }}
      transition="all 0.2s"
      rightIcon={showArrow ? <ArrowRightIcon size={20} /> : undefined}
      borderRadius="lg"
      {...props}
    >
      {children}
    </Button>
  );
}

