import { HStack, Box, Text } from '@chakra-ui/react';
import { InfoIcon } from '../../icons';

export function LocationTabInfoBanner() {
  return (
    <HStack
      align="flex-start"
      spacing={3}
      bg="brand.50"
      borderRadius="lg"
      px={4}
      py={3}
    >
      <Box color="brand.500" mt="2px" flexShrink={0}>
        <InfoIcon size={18} />
      </Box>
      <Text fontSize="sm" color="text.body" lineHeight="1.5">
        Turn on each channel your business uses. They appear as separate rows on your
        booking page under <Text as="span" fontWeight="700">How to reach us</Text>.
        Empty channels are hidden automatically.
      </Text>
    </HStack>
  );
}
