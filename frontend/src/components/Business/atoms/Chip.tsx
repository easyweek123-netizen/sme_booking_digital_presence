import { Tag, type TagProps } from '@chakra-ui/react';

interface ChipProps extends Omit<TagProps, 'children'> {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'brand';
}

export function Chip({ label, tone = 'neutral', ...rest }: ChipProps) {
  const palette = {
    neutral: { bg: 'gray.100', color: 'gray.700' },
    success: { bg: 'green.50', color: 'green.700' },
    warning: { bg: 'orange.50', color: 'orange.700' },
    brand: { bg: 'var(--brand-accent-soft)', color: 'var(--brand-accent)' },
  }[tone];
  return (
    <Tag size="sm" fontWeight={600} borderRadius="full" px={2.5} {...palette} {...rest}>
      {label}
    </Tag>
  );
}
