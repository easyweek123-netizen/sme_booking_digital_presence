import { VStack } from '@chakra-ui/react';
import { SkeletonCard } from './SkeletonCard';

interface SkeletonListProps {
  count?: number;
  hasImage?: boolean;
  spacing?: number;
}

export function SkeletonList({
  count = 3,
  hasImage = false,
  spacing = 4,
}: SkeletonListProps) {
  return (
    <VStack spacing={spacing} align="stretch">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} hasImage={hasImage} />
      ))}
    </VStack>
  );
}
