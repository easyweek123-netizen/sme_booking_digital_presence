import { Box, HStack, VStack, Text, Button } from '@chakra-ui/react';
import { formatPrice } from '../../../../utils/format';
import type { Service } from '../../../../types';

interface Props {
  selectedService: Service | null;
  canContinue: boolean;
  onContinue: () => void;
  label: string;
  step: number;
}

export function MobileBookingFooter({ selectedService, canContinue, onContinue, label, step }: Props) {
  return (
    <Box
      display="block"
      position="sticky"
      bottom={0}
      zIndex={20}
      bg="surface.card"
      borderTop="1px solid"
      borderColor="border.subtle"
      px={4}
      py={4}
    >
      <HStack justify="space-between" spacing={3}>
        <VStack align="start" spacing={0} minW={0}>
          <Text
            fontSize="xs"
            color="text.muted"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Selected
          </Text>
          <Text fontSize="sm" fontWeight="600" color="text.heading" noOfLines={1}>
            {selectedService
              ? `${selectedService.name} · ${formatPrice(Number(selectedService.price))}`
              : 'No service selected'}
          </Text>
        </VStack>
        {step <=2 && <Button
          bg="brand.500"
          color="white"
          _hover={{ bg: 'brand.600' }}
          borderRadius="xl"
          h={12}
          px={6}
          fontWeight="600"
          isDisabled={!canContinue}
          onClick={onContinue}
          flexShrink={0}
        >
          {label}
        </Button>}
      </HStack>
    </Box>
  );
}
