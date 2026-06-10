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
    _disabled: { bg: 'border.subtle', color: 'white', cursor: 'not-allowed' },
  },
  outline: {
    bg: 'surface.card',
    color: 'text.heading',
    border: '1px solid',
    borderColor: 'border.subtle',
    _hover: { bg: 'surface.alt' },
  },
  ghost: {
    bg: 'transparent',
    color: 'text.heading',
    _hover: { bg: 'surface.muted' },
  },
  soft: {
    bg: 'surface.muted',
    color: 'text.heading',
    _hover: { bg: 'border.subtle' },
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
