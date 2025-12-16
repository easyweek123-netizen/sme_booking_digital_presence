import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Divider,
  Spinner,
  Center,
  Heading,
} from '@chakra-ui/react';
import { useGetCustomerQuery } from '../../store/api';
import { NotesEditor } from '../NotesEditor';
import { CollapsibleSection } from '../CollapsibleSection';
import { BookingCard } from '../BookingCard';
import { NoteIcon, CalendarIcon } from '../icons';
import { useGetNotesQuery } from '../../store/api';
import type { Booking } from '../../types';

interface ClientDetailDrawerProps {
  customerId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailDrawer({
  customerId,
  isOpen,
  onClose,
}: ClientDetailDrawerProps) {
  const { data: customer, isLoading } = useGetCustomerQuery(customerId, {
    skip: !isOpen,
  });

  // Fetch notes count for the customer
  const { data: notes = [] } = useGetNotesQuery(
    { customerId },
    { skip: !isOpen }
  );

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={{ base: "full", md: "md" }}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Client Details</DrawerHeader>

        <DrawerBody>
          {isLoading ? (
            <Center py={12}>
              <Spinner size="lg" />
            </Center>
          ) : customer ? (
            <VStack spacing={5} align="stretch" py={4}>
              {/* Customer Info - Always visible */}
              <Box>
                <Heading size="md" mb={3}>
                  {customer.name}
                </Heading>
                <VStack align="stretch" spacing={2}>
                  {customer.email && (
                    <HStack>
                      <Text fontSize="sm" color="gray.500" minW="60px">
                        Email:
                      </Text>
                      <Text fontSize="sm">{customer.email}</Text>
                    </HStack>
                  )}
                  <HStack>
                    <Text fontSize="sm" color="gray.500" minW="60px">
                      Joined:
                    </Text>
                    <Text fontSize="sm">
                      {new Date(customer.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              <Divider />

              {/* Client Notes - Collapsible, closed by default */}
              <CollapsibleSection
                title="Client Notes"
                count={notes.length}
                icon={<NoteIcon size={16} />}
                defaultOpen={false}
              >
                <NotesEditor customerId={customerId} />
              </CollapsibleSection>

              <Divider />

              {/* Booking History - Collapsible, open by default */}
              <CollapsibleSection
                title="Booking History"
                count={customer.bookings?.length || 0}
                icon={<CalendarIcon size={16} />}
                defaultOpen={true}
              >
                {customer.bookings && customer.bookings.length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {customer.bookings.map((booking: Booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        variant="compact"
                        showNotes={true}
                      />
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="sm" color="gray.500" py={2}>
                    No bookings yet
                  </Text>
                )}
              </CollapsibleSection>
            </VStack>
          ) : (
            <Center py={12}>
              <Text color="gray.500">Customer not found</Text>
            </Center>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
