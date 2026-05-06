import { Badge, Box, Button, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import type { CheckoutResponse } from '../../types/billing.types';
import { cycleLabel, planLabel } from '../../utils/billingLabels';
import { formatPrice } from '../../utils/format';

interface InstantConfirmFormProps {
  response: CheckoutResponse;
  confirming: boolean;
  onConfirm: () => void;
}

export function InstantConfirmForm({
  response,
  confirming,
  onConfirm,
}: InstantConfirmFormProps) {
  const amountLabel = formatPrice(response.amountCents / 100, response.currency);

  return (
    <Box bg="surface.card" border="1px solid" borderColor="border.subtle" borderRadius="xl" p={5}>
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between" align="start">
          <Box>
            <Text fontWeight="800" color="text.primary">Confirm subscription</Text>
            <Text color="text.secondary" fontSize="sm">
              Demo mode — no card required.
            </Text>
          </Box>
          <Badge colorScheme="purple">demo</Badge>
        </HStack>

        <Divider borderColor="border.subtle" />

        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text color="text.muted" fontSize="sm">Plan</Text>
            <Text fontWeight="700" color="text.primary">{planLabel(response.plan)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text color="text.muted" fontSize="sm">Billing cycle</Text>
            <Text fontWeight="700" color="text.primary">{cycleLabel(response.cycle)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text color="text.muted" fontSize="sm">Total</Text>
            <Text fontWeight="800" color="text.primary">{amountLabel}</Text>
          </HStack>
        </VStack>

        <Button colorScheme="brand" onClick={onConfirm} isLoading={confirming}>
          Confirm payment
        </Button>

        <Text color="text.muted" fontSize="xs">Session: {response.sessionId}</Text>
      </VStack>
    </Box>
  );
}
