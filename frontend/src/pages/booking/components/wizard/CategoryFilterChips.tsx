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
    { id: null as number | null, name: 'Featured' },
    ...categories.map((c) => ({ id: c.id as number | null, name: c.name })),
  ];

  return (
    <Box overflowX="auto" mb={6} mx={{ base: -4, md: 0 }} px={{ base: 4, md: 0 }} sx={{
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    }}>
      <HStack spacing={2} minW="max-content">
        {chips.map((c) => {
          const active = c.id === selectedCategoryId;
          return (
            <Button
              key={c.id ?? 'all'}
              onClick={() => onSelect(c.id)}
              h="38px"
              px={5}
              borderRadius="full"
              fontWeight="700"
              fontSize="xs"
              bg={active ? 'black' : 'white'}
              color={active ? 'white' : 'black'}
              border={active ? 'none' : '1px solid'}
              borderColor={active ? 'transparent' : '#ECECEC'}
              _hover={{ bg: active ? 'black' : 'gray.50' }}
              _active={{ transform: 'scale(0.97)' }}
              flexShrink={0}
              transition="all 0.15s ease"
            >
              {c.name}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
}
