import { VStack, Box, Text } from '@chakra-ui/react';

interface Props {
  id: number;
  label: string;
  isSelected: boolean;
  onSelect: (id: number, label: string) => void;
}

import type { ComponentType } from 'react';
import {
  ScissorsIcon,
  BriefcaseIcon,
  LayersIcon,
} from '../../icons';

export type CategoryIconProps = { size?: number; color?: string };

const FALLBACK: ComponentType<CategoryIconProps> = LayersIcon;

const ICONS_BY_SLUG: Record<string, ComponentType<CategoryIconProps>> = {
  'hair-salon': ScissorsIcon,
  'barber': ScissorsIcon,
  'beauty': BriefcaseIcon,
};

function getCategoryIcon(slugOrLabel: string): ComponentType<CategoryIconProps> {
  const key = slugOrLabel.toLowerCase().replace(/\s+/g, '-');
  return ICONS_BY_SLUG[key] ?? FALLBACK;
}

export function BusinessTypeCard({ id, label, isSelected, onSelect }: Props) {
  const Icon = getCategoryIcon(label);
  return (
    <Box
      as="button"
      type="button"
      onClick={() => onSelect(id, label)}
      aria-pressed={isSelected}
      bg={isSelected ? 'accent.soft' : 'surface.card'}
      border="1px solid"
      borderColor={isSelected ? 'accent.primary' : 'border.subtle'}
      borderRadius="2xl"
      px={4}
      py={5}
      transition="all 0.15s ease"
      _hover={{ borderColor: 'accent.hover', transform: 'translateY(-1px)' }}
    >
      <VStack spacing={2}>
        <Box color={isSelected ? 'accent.primary' : 'text.primary'}><Icon size={24} /></Box>
        <Text color="text.primary" fontSize="sm" fontWeight="600">
          {label}
        </Text>
      </VStack>
    </Box>
  );
}
