import { useState } from 'react';
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
  Badge,
  Divider,
  Heading,
  Textarea,
  Button,
  useToast,
} from '@chakra-ui/react';
import { CollapsibleSection } from '../CollapsibleSection';
import { NoteIcon } from '../icons';
import { useGetNotesQuery, useCreateNoteMutation } from '../../store/api';
import { formatBookingDate, formatPrice } from '../../utils/format';
import { BOOKING_STATUS_CONFIG } from '../../constants';
import { NotesList } from './NotesList';
import type { Booking } from '../../types';

interface BookingDetailDrawerProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailDrawer({
  booking,
  isOpen,
  onClose,
}: BookingDetailDrawerProps) {
  const [noteContent, setNoteContent] = useState('');
  const toast = useToast();

  // Fetch notes for this booking
  const { data: notes = [] } = useGetNotesQuery(
    { bookingId: booking.id },
    { skip: !isOpen }
  );

  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();

  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    try {
      await createNote({
        content: noteContent,
        bookingId: booking.id,
        customerId: booking.customerId,
      }).unwrap();

      setNoteContent('');
      toast({
        title: 'Note added',
        status: 'success',
        duration: 2000,
      });
    } catch {
      toast({
        title: 'Failed to add note',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={{ base: "full", md: "md" }}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Booking Details</DrawerHeader>

        <DrawerBody>
          <VStack spacing={5} align="stretch" py={4}>
            {/* Booking Header - Service & Status */}
            <Box>
              <HStack justify="space-between" mb={3}>
                <Heading size="md">{booking.service?.name}</Heading>
                <Badge
                  bg={statusConfig.bg}
                  color={statusConfig.color}
                  fontSize="sm"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                >
                  {statusConfig.label}
                </Badge>
              </HStack>

              {/* Booking Info Grid */}
              <VStack align="stretch" spacing={2}>
                <HStack>
                  <Text fontSize="sm" color="gray.500" minW="100px">
                    Reference:
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" fontFamily="mono">
                    {booking.reference}
                  </Text>
                </HStack>

                <HStack>
                  <Text fontSize="sm" color="gray.500" minW="100px">
                    Date & Time:
                  </Text>
                  <Text fontSize="sm">
                    {formatBookingDate(booking.date)} at {booking.startTime} -{' '}
                    {booking.endTime}
                  </Text>
                </HStack>

                <HStack>
                  <Text fontSize="sm" color="gray.500" minW="100px">
                    Customer:
                  </Text>
                  <Text fontSize="sm">{booking.customerName}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="sm" color="gray.500" minW="100px">
                    Email:
                  </Text>
                  <Text fontSize="sm">{booking.customerEmail}</Text>
                </HStack>

                {booking.service && (
                  <>
                    <HStack>
                      <Text fontSize="sm" color="gray.500" minW="100px">
                        Duration:
                      </Text>
                      <Text fontSize="sm">
                        {booking.service.durationMinutes} minutes
                      </Text>
                    </HStack>

                    <HStack>
                      <Text fontSize="sm" color="gray.500" minW="100px">
                        Price:
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {formatPrice(booking.service.price)}
                      </Text>
                    </HStack>
                  </>
                )}

                <HStack>
                  <Text fontSize="sm" color="gray.500" minW="100px">
                    Created:
                  </Text>
                  <Text fontSize="sm">
                    {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            {/* Quick Add Note - Always visible */}
            <Box>
              <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                Add Session Note
              </Text>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write a note about this session..."
                size="sm"
                rows={2}
                mb={2}
              />
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleAddNote}
                isLoading={isCreating}
                isDisabled={!noteContent.trim()}
              >
                Add Note
              </Button>
            </Box>

            {/* Existing Notes - Collapsible */}
            {notes.length > 0 && (
              <>
                <Divider />
                <CollapsibleSection
                  title="Previous Notes"
                  count={notes.length}
                  icon={<NoteIcon size={16} />}
                  defaultOpen={true}
                >
                  <NotesList 
                    bookingId={booking.id} 
                    customerId={booking.customerId}
                  />
                </CollapsibleSection>
              </>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
