import { Box, Skeleton, VStack } from '@chakra-ui/react';
import { SkeletonCard } from './SkeletonCard';
import { SkeletonList } from './SkeletonList';

interface PageLoadingProps {
  variant?: 'list' | 'detail' | 'form';
}

function HeaderStub() {
  return (
    <Box mb={6}>
      <Skeleton h="32px" w="200px" mb={2} />
      <Skeleton h="16px" w="320px" />
    </Box>
  );
}

export function PageLoading({ variant = 'list' }: PageLoadingProps) {
  return (
    <Box>
      <HeaderStub />
      {variant === 'list' && <SkeletonList count={5} hasImage />}
      {variant === 'detail' && (
        <VStack spacing={4} align="stretch">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </VStack>
      )}
      {variant === 'form' && <SkeletonCard hasImage={false} lines={6} />}
    </Box>
  );
}
