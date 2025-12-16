import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { SearchIcon } from '../../components/icons';
import { useGetCustomersQuery } from '../../store/api';
import { ClientDetailDrawer } from '../../components/ClientDetailDrawer';
import type { Customer } from '../../types';

export function DashboardClients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: customers = [], isLoading } = useGetCustomersQuery();

  // Filter customers based on search query
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
        <Box>
          <Heading size="lg" color="gray.900" mb={1}>
            Clients
          </Heading>
          <Text color="gray.500">
            Manage your clients and their booking history
          </Text>
        </Box>

        {/* Search */}
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none" color="gray.400">
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
          <Center py={12}>
            <Spinner size="lg" color="blue.500" />
          </Center>
        ) : filteredCustomers.length === 0 ? (
          <Center py={12}>
            <VStack spacing={2}>
              <Text color="gray.500" fontSize="lg">
                {searchQuery ? 'No clients found' : 'No clients yet'}
              </Text>
              {!searchQuery && (
                <Text color="gray.400" fontSize="sm">
                  Clients will appear here after they make their first booking
                </Text>
              )}
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {filteredCustomers.map((customer) => (
              <Box
                key={customer.id}
                bg="white"
                borderRadius="xl"
                border="1px"
                borderColor="gray.200"
                p={4}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'blue.300', shadow: 'sm' }}
                onClick={() => handleCustomerClick(customer)}
              >
                <VStack align="stretch" spacing={2}>
                  <Text fontWeight="semibold" fontSize="lg" noOfLines={1}>
                    {customer.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {customer.email || 'No email'}
                  </Text>
                  <HStack justify="space-between" pt={2}>
                    <Text fontSize="sm" color="gray.500">
                      {customer.bookings?.length || 0} booking{(customer.bookings?.length || 0) !== 1 ? 's' : ''}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
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
          <Text fontSize="sm" color="gray.500">
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

