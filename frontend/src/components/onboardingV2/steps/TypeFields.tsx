import { SimpleGrid } from '@chakra-ui/react';
import { BusinessTypeCard } from '../fields/BusinessTypeCard';
import { useGetBusinessCategoriesQuery } from '../../../store/api/businessApi';
import type { StepProps } from '../types';

export function TypeFields({ flow }: StepProps) {
  const { state, update } = flow;
  const { data: categories = [] } = useGetBusinessCategoriesQuery();
  const types = categories.flatMap((c) => c.types ?? []);

  return (
    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
      {types.map((t) => (
        <BusinessTypeCard
          key={t.id}
          id={t.id}
          label={t.name}
          isSelected={state.typeId === t.id}
          onSelect={() => update({ typeId: t.id, typeLabel: t.name })}
        />
      ))}
    </SimpleGrid>
  );
}
