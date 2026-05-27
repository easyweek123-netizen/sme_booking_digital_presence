import { Button, type ButtonProps } from '@chakra-ui/react';

type BrandButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft';

interface BrandButtonProps extends Omit<ButtonProps, 'variant'> {
  brandVariant?: BrandButtonVariant;
}

const VARIANT_STYLES: Record<BrandButtonVariant, ButtonProps> = {
  solid: {
    bg: 'var(--brand-accent)',
    color: 'var(--brand-on-accent)',
    _hover: { filter: 'brightness(0.95)' },
    _active: { filter: 'brightness(0.9)' },
    _disabled: { bg: 'gray.300', color: 'white', cursor: 'not-allowed' },
  },
  outline: {
    bg: 'white',
    color: 'gray.900',
    border: '1px solid',
    borderColor: 'gray.300',
    _hover: { bg: 'gray.50' },
  },
  ghost: {
    bg: 'transparent',
    color: 'gray.900',
    _hover: { bg: 'gray.100' },
  },
  soft: {
    bg: 'gray.100',
    color: 'gray.900',
    _hover: { bg: 'gray.200' },
  },
};

export function BrandButton({
  brandVariant = 'solid',
  children,
  ...props
}: BrandButtonProps) {
  return (
    <Button
      borderRadius="full"
      fontWeight={600}
      letterSpacing="-0.005em"
      transition="background .15s, transform .05s, filter .15s"
      {...VARIANT_STYLES[brandVariant]}
      {...props}
    >
      {children}
    </Button>
  );
}
