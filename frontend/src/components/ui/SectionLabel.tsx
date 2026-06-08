import { Text, type TextProps } from '@chakra-ui/react';

/**
 * Eyebrow-style section label. Replaces the
 * `{ fontSize: 'xs', fontWeight: '700', color: 'text.muted',
 *    textTransform: 'uppercase', letterSpacing: '0.04em' }`
 * block repeated 4× across the location pickers.
 */
export function SectionLabel(props: TextProps) {
  return (
    <Text
      fontSize="xs"
      fontWeight="700"
      color="text.muted"
      textTransform="uppercase"
      letterSpacing="0.04em"
      {...props}
    />
  );
}
