import { Box, Heading, Text, SimpleGrid, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { CategoryFilterChips } from './CategoryFilterChips';
import { BookingServiceCard } from './BookingServiceCard';
import type { Service, ServiceCategory } from '../../../../types';

interface Props {
  services: Service[];
  selectedServiceId: number | null;
  onSelectService: (s: Service) => void;
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export function ServiceStep({
  services,
  selectedServiceId,
  onSelectService,
  selectedCategoryId,
  onSelectCategory,
}: Props) {
  const categories = useMemo<ServiceCategory[]>(() => {
    const map = new Map<number, ServiceCategory>();
    for (const s of services) if (s.category) map.set(s.category.id, s.category);
    return Array.from(map.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [services]);

  const filtered = useMemo(
    () =>
      selectedCategoryId == null
        ? services
        : services.filter((s) => s.categoryId === selectedCategoryId),
    [services, selectedCategoryId],
  );

  return (
    <VStack align="stretch" spacing={0}>
      <Heading fontSize="2xl" fontWeight="700" color="black" mb={5} letterSpacing="-0.015em">
        Services
      </Heading>

      <CategoryFilterChips
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={onSelectCategory}
      />

      {filtered.length === 0 ? (
        <Box p={8} textAlign="center" bg="surface.alt" borderRadius="xl">
          <Text color="text.muted">No services in this category.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={1} spacing={3.5}>
          {filtered.map((s) => (
            <BookingServiceCard
              key={s.id}
              service={s}
              isSelected={s.id === selectedServiceId}
              onSelect={() => onSelectService(s)}
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
}
