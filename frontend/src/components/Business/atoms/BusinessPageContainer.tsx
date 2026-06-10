import { Box, type BoxProps } from '@chakra-ui/react';

/**
 * Single source of truth for the public booking page's max-width and
 * horizontal gutters. Used by hero, header, sticky nav, and the body grid.
 */
export function BusinessPageContainer(props: BoxProps) {
  return (
    <Box
      maxW="1240px"
      mx="auto"
      px={4}
      {...props}
    />
  );
}
