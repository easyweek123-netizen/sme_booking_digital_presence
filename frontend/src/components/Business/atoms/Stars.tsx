import { Box, HStack, Text } from '@chakra-ui/react';
import { StarIcon } from '../../icons';

interface StarsProps {
  rating: number;
  size?: number;
}

export function Stars({ rating, size = 14 }: StarsProps) {
  const full = Math.round(rating);
  return (
    <HStack spacing={0.5}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} color={i < full ? 'yellow.400' : 'gray.300'} lineHeight={0}>
          <StarIcon size={size} />
        </Box>
      ))}
      <Text ml={1} fontSize="sm" color="gray.700" fontWeight={600}>
        {rating.toFixed(1)}
      </Text>
    </HStack>
  );
}
