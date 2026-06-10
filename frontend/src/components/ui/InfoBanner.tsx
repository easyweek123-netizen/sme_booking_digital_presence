import { Box, HStack, Text, type StackProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { InfoIcon } from '../icons';

interface InfoBannerProps extends StackProps {
  children: ReactNode;
}

/**
 * Brand-tinted info banner. Used at the top of tabs to explain the section.
 * Replaces the one-off `LocationTabInfoBanner`.
 */
export function InfoBanner({ children, ...rest }: InfoBannerProps) {
  return (
    <HStack
      align="flex-start"
      spacing={3}
      bg="brand.50"
      borderRadius="lg"
      px={4}
      py={3}
      {...rest}
    >
      <Box color="brand.500" mt="2px" flexShrink={0}>
        <InfoIcon size={18} />
      </Box>
      <Text fontSize="sm" color="text.body" lineHeight="1.5">
        {children}
      </Text>
    </HStack>
  );
}
