import { HStack, Button, Box } from '@chakra-ui/react';
import type { ServiceCategory } from '../../../../types';

interface Props {
  categories: ServiceCategory[];
  selectedCategoryId: number | null;
  onSelect: (id: number | null) => void;
}

export function CategoryFilterChips({ categories, selectedCategoryId, onSelect }: Props) {
  if (categories.length === 0) return null;
  const chips = [
    { id: null as number | null, name: 'All' },
    ...categories.map((c) => ({ id: c.id as number | null, name: c.name })),
  ];

  return (
    <Box overflowX="auto" mb={6} mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }}>
      <HStack spacing={2} minW="max-content">
        {chips.map((c) => {
          const active = c.id === selectedCategoryId;
          return (
            <Button
              key={c.id ?? 'all'}
              onClick={() => onSelect(c.id)}
              h={9}
              px={4}
              borderRadius="full"
              fontWeight="600"
              fontSize="sm"
              bg={active ? 'gray.800' : 'surface.card'}
              color={active ? 'white' : 'text.primary'}
              border="1px solid"
              borderColor={active ? 'gray.800' : 'border.subtle'}
              _hover={{ bg: active ? 'gray.700' : 'surface.alt' }}
              flexShrink={0}
            >
              {c.name}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
}
