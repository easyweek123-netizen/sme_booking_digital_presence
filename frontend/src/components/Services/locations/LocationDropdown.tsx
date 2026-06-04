import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon, MapPinIcon, TrashIcon, XIcon } from '../../icons';
import { locationIcon, locationLabel, locationTypeLabel } from './locationDisplay';
import { useDeleteLocationMutation } from '../../../store/api/locationsApi';
import { TOAST_DURATION } from '../../../constants';
import { getErrorMessage, isRtkQueryError } from '../../../types';
import type { Location } from '../../../types/location';

interface Props {
  locations: Location[];
  selectedId: number | null;
  onPreview: (loc: Location | null) => void;
  onDeleted?: (id: number) => void;
  isDisabled?: boolean;
}

function extractDeleteError(error: unknown): string {
  if (isRtkQueryError(error)) {
    const msg = (error.data as { message?: string | { message?: string } } | undefined)?.message;
    if (typeof msg === 'string') return msg;
    if (msg && typeof msg === 'object' && typeof msg.message === 'string') return msg.message;
  }
  return getErrorMessage(error, 'Could not delete location.');
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <Box
      w={9}
      h={9}
      borderRadius="sm"
      bg="surface.muted"
      color="text.muted"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {children}
    </Box>
  );
}

function LocationRow({ loc }: { loc: Location }) {
  const title = loc.label ?? locationLabel(loc);
  const subtitle = loc.label ? locationLabel(loc) : null;

  return (
    <HStack spacing={3} w="100%" minW={0} borderRadius="sm" textAlign="left">
      <IconTile>{locationIcon(loc.type, 18)}</IconTile>
      <Box flex={1} minW={0}>
        <Text fontSize="sm" fontWeight="600" color="text.heading" noOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="xs" color="text.muted" noOfLines={1}>
            {subtitle}
          </Text>
        )}
      </Box>
      <Badge variant="subtle" borderRadius="full" px={2.5} flexShrink={0}>
        {locationTypeLabel(loc.type)}
      </Badge>
    </HStack>
  );
}

export function LocationDropdown({
  locations,
  selectedId,
  onPreview,
  onDeleted,
  isDisabled = false,
}: Props) {
  const toast = useToast();
  // Chakra UI's AlertDialog requires `leastDestructiveRef` for accessibility:
  // focus moves to the safe button (Cancel) on open, so a stray keystroke can't
  // confirm destruction. The ref is part of the Chakra API; not removable.
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);
  const [deleteLocation, { isLoading: isDeleting }] = useDeleteLocationMutation();

  const selected = locations.find((l) => l.id === selectedId) ?? null;

  const handleDeleteClick = (e: MouseEvent, loc: Location) => {
    e.stopPropagation();
    setDeletingLocation(loc);
    openDelete();
  };

  const handleConfirmDelete = async () => {
    if (!deletingLocation) return;

    try {
      await deleteLocation(deletingLocation.id).unwrap();
      toast({
        title: 'Location deleted',
        status: 'success',
        duration: TOAST_DURATION.MEDIUM,
      });
      onDeleted?.(deletingLocation.id);
      closeDelete();
      setDeletingLocation(null);
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: extractDeleteError(error),
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  const handleCloseDelete = () => {
    closeDelete();
    setDeletingLocation(null);
  };

  const deleteTargetLabel = deletingLocation
    ? (deletingLocation.label ?? locationLabel(deletingLocation))
    : '';

  return (
    <>
      <Menu matchWidth placement="bottom-start" isLazy gutter={6}>
        {({ isOpen }) => (
          <>
            <MenuButton
              type="button"
              disabled={isDisabled}
              width="100%"
              h="56px"
              px={3}
              textAlign="left"
              bg="surface.card"
              border="1px solid"
              borderColor={isOpen ? 'brand.500' : 'border.strong'}
              boxShadow={isOpen ? 'inputFocus' : undefined}
              borderRadius="sm"
              display="flex"
              alignItems="center"
              transition="border-color 0.15s, box-shadow 0.15s"
              opacity={isDisabled ? 0.6 : 1}
              cursor={isDisabled ? 'not-allowed' : 'pointer'}
              _hover={!isDisabled && !isOpen ? { borderColor: 'gray.500' } : undefined}
            >
              <HStack spacing={3} w="100%">
                {selected ? (
                  <LocationRow loc={selected} />
                ) : (
                  <HStack w="100%" textAlign="left">
                    <IconTile>
                      <MapPinIcon size={18} />
                    </IconTile>
                    <Text flex={1} fontSize="sm" color="text.muted" noOfLines={1}>
                      Select from existing location
                    </Text>
                  </HStack>
                )}
                <Box
                  color="text.muted"
                  flexShrink={0}
                  transition="transform 0.15s"
                  transform={isOpen ? 'rotate(180deg)' : undefined}
                >
                  <ChevronDownIcon size={18} />
                </Box>
              </HStack>
            </MenuButton>

            <MenuList maxH="320px" overflowY="auto" py={1} boxShadow="popover">
              {selectedId != null && (
                <MenuItem
                  onClick={() => onPreview(null)}
                  px={3}
                  py={2.5}
                  color="text.muted"
                  _hover={{ bg: 'surface.alt' }}
                >
                  <HStack spacing={3} w="100%">
                    <IconTile>
                      <XIcon size={18} />
                    </IconTile>
                    <Text fontSize="sm">Clear selection</Text>
                  </HStack>
                </MenuItem>
              )}
              {locations.map((loc) => (
                <MenuItem
                  key={loc.id}
                  onClick={() => onPreview(loc)}
                  px={3}
                  py={2.5}
                  bg={loc.id === selectedId ? 'accent.soft' : undefined}
                  _hover={{ bg: loc.id === selectedId ? 'accent.soft' : 'surface.alt' }}
                >
                  <HStack spacing={2} w="100%" minW={0}>
                    <Box flex={1} minW={0}>
                      <LocationRow loc={loc} />
                    </Box>
                    <IconButton
                      aria-label={`Delete ${loc.label ?? locationLabel(loc)}`}
                      icon={<TrashIcon size={16} />}
                      size="sm"
                      variant="ghost"
                      color="text.muted"
                      flexShrink={0}
                      _hover={{ color: 'red.500', bg: 'red.50' }}
                      onClick={(e) => handleDeleteClick(e, loc)}
                    />
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="600">
              Delete location
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete{' '}
              <Text as="span" fontWeight="600">
                {deleteTargetLabel}
              </Text>
              ? This cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={handleCloseDelete}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => void handleConfirmDelete()}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
