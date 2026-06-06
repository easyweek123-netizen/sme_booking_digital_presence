import { HStack, Text } from '@chakra-ui/react';
import type { ResponsiveValue } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  size?: ResponsiveValue<string>;
}

export function ServiceDescription({ children, size = 'sm' }: Props) {
  return (
    <HStack spacing={4} flexWrap="wrap" fontSize={size}>
      {children}
    </HStack>
  );
}

export function DescriptionItem({ icon, label }: { icon?: ReactNode; label: string }) {
  if (!label) return null;
  return (
    <HStack spacing={1.5}>
      {icon}
      <Text as="span" color="inherit">{label}</Text>
    </HStack>
  );
}
