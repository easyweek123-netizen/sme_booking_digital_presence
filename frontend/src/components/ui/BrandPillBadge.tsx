import { Badge, HStack, type BadgeProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface BrandPillBadgeProps extends BadgeProps {
  /** Optional icon rendered before the text. */
  leftIcon?: ReactNode;
  children: ReactNode;
}

/**
 * Small rounded brand-tinted badge.
 * Used for tab completion ("3/4", "✓ 4/4") and "Recommended" tags.
 */
export function BrandPillBadge({ leftIcon, children, ...rest }: BrandPillBadgeProps) {
  return (
    <Badge
      bg="brand.50"
      color="brand.700"
      borderRadius="full"
      px={2}
      py={0.5}
      fontSize="2xs"
      fontWeight="600"
      display="inline-flex"
      alignItems="center"
      textTransform="none"
      {...rest}
    >
      {leftIcon ? (
        <HStack spacing={1}>
          {leftIcon}
          <span>{children}</span>
        </HStack>
      ) : (
        children
      )}
    </Badge>
  );
}
