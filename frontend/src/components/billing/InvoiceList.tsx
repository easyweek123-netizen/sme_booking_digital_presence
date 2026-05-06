import { Badge, Box, HStack, Link, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { ExternalLinkIcon, NoteIcon } from '../icons';
import { EmptyState, SkeletonList } from '../ui/states';
import type { InvoiceDto, InvoiceStatus } from '../../types/billing.types';
import { formatBillingDate } from '../../utils/billingLabels';
import { formatPrice } from '../../utils/format';

interface InvoiceListProps {
  invoices: InvoiceDto[];
  loading: boolean;
  error: boolean;
}

function statusColor(status: InvoiceStatus): string {
  if (status === 'paid') return 'green';
  if (status === 'open') return 'yellow';
  if (status === 'void') return 'gray';
  return 'gray';
}

export function InvoiceList({ invoices, loading, error }: InvoiceListProps) {
  if (loading) return <SkeletonList count={3} />;

  if (error) {
    return (
      <Box bg="surface.card" border="1px solid" borderColor="border.subtle" borderRadius="xl" p={5}>
        <Text color="text.secondary">Unable to load invoices right now.</Text>
      </Box>
    );
  }

  if (invoices.length === 0) {
    return (
      <Box bg="surface.card" border="1px solid" borderColor="border.subtle" borderRadius="xl">
        <EmptyState
          icon={<NoteIcon size={28} />}
          title="No invoices yet."
          description="Invoices will appear here after your first payment."
          size="sm"
        />
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={3}>
      {invoices.map((inv) => (
        <Box
          key={inv.providerInvoiceId}
          bg="surface.card"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="xl"
          p={5}
        >
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={3} alignItems="center">
            <Box>
              <Text fontSize="sm" color="text.muted">Paid</Text>
              <Text fontWeight="600" color="text.primary">
                {formatBillingDate(inv.paidAt)}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="text.muted">Amount</Text>
              <Text fontWeight="600" color="text.primary">
                {formatPrice(inv.amountCents / 100, inv.currency)}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="text.muted">Status</Text>
              <Badge colorScheme={statusColor(inv.status)} textTransform="capitalize">
                {inv.status.replace('_', ' ')}
              </Badge>
            </Box>
            <HStack justify={{ base: 'flex-start', md: 'flex-end' }}>
              {inv.hostedUrl ? (
                <Link href={inv.hostedUrl} isExternal color="brand.600" fontWeight="600">
                  View receipt <ExternalLinkIcon size={14} />
                </Link>
              ) : (
                <Text color="text.muted" fontSize="sm">Receipt unavailable</Text>
              )}
            </HStack>
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  );
}
