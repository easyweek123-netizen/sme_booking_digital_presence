import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { SearchIcon, UsersIcon } from '../../components/icons';
import { useGetCustomersQuery } from '../../store/api';
import { ClientDetailDrawer } from '../../components/ClientDetailDrawer';
import type { Customer } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonList, EmptyState } from '../../components/ui/states';

export function DashboardClients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: customers = [], isLoading } = useGetCustomersQuery();

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    onOpen();
  };

  const handleClose = () => {
    onClose();
    setSelectedCustomer(null);
  };

  return (
    <>
      <VStack spacing={6} align="stretch">
        <PageHeader
          title="Clients"
          description="Manage your clients and their booking history"
        />

        {/* Search */}
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none" color="text.muted">
            <SearchIcon size={16} />
          </InputLeftElement>
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        {/* Clients Table */}
        {isLoading ? (
          <SkeletonList count={5} />
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            icon={<UsersIcon size={28} />}
            title={searchQuery ? 'No clients found' : 'No clients yet'}
            description={
              searchQuery
                ? undefined
                : 'Clients will appear here once they book an appointment.'
            }
          />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {filteredCustomers.map((customer) => (
              <Box
                key={customer.id}
                bg="surface.card"
                borderRadius="sm"
                border="1px"
                borderColor="border.subtle"
                p={4}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'brand.300', shadow: 'sm' }}
                onClick={() => handleCustomerClick(customer)}
              >
                <VStack align="stretch" spacing={2}>
                  <Text fontWeight="semibold" fontSize="lg" noOfLines={1}>
                    {customer.name}
                  </Text>
                  <Text fontSize="sm" color="text.secondary" noOfLines={1}>
                    {customer.email || 'No email'}
                  </Text>
                  <HStack justify="space-between" pt={2}>
                    <Text fontSize="sm" color="text.secondary">
                      {customer.bookings?.length || 0} booking{(customer.bookings?.length || 0) !== 1 ? 's' : ''}
                    </Text>
                    <Text fontSize="sm" color="text.muted">
                      {new Date(customer.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}

        {/* Results count */}
        {!isLoading && filteredCustomers.length > 0 && (
          <Text fontSize="sm" color="text.secondary">
            Showing {filteredCustomers.length} of {customers.length} clients
          </Text>
        )}
      </VStack>

      {/* Client Detail Drawer */}
      {selectedCustomer && (
        <ClientDetailDrawer
          customerId={selectedCustomer.id}
          isOpen={isOpen}
          onClose={handleClose}
        />
      )}
    </>
  );
}
