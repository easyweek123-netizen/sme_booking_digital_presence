import { Box, Skeleton, SkeletonText } from '@chakra-ui/react';

interface SkeletonCardProps {
  h?: string | number;
  w?: string | number;
  hasImage?: boolean;
  lines?: number;
}

export function SkeletonCard({
  h = 'auto',
  w = 'full',
  hasImage = false,
  lines = 2,
}: SkeletonCardProps) {
  return (
    <Box
      h={h}
      w={w}
      bg="surface.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      p={5}
      shadow="card"
    >
      {hasImage && <Skeleton h="120px" borderRadius="lg" mb={4} />}
      <Skeleton h="20px" w="60%" mb={3} />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonText
          key={i}
          noOfLines={1}
          skeletonHeight="14px"
          mt={2}
          w={i % 2 === 0 ? 'full' : '80%'}
        />
      ))}
    </Box>
  );
}
