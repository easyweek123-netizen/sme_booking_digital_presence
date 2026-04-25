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
  const { color } = props;

  return (
    <Button
      bg={isLight ? 'surface.card' : 'gray.800'}
      color={color ? color : isLight ? 'text.heading' : 'white'}
      fontWeight="600"
      px={props.size === 'lg' ? 8 : 6}
      _hover={{
        bg: isLight ? 'surface.page' : 'brand.600',
        transform: 'translateY(-2px)',
      }}
      _active={{
        bg: isLight ? 'surface.muted' : 'brand.700',
        transform: 'translateY(0)',
      }}
      transition="all 0.2s"
      rightIcon={showArrow ? <ArrowRightIcon size={20} /> : undefined}
      borderRadius="sm"
      {...props}
    >
      {children}
    </Button>
  );
}

