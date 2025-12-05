import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Switch,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useGetMyBusinessQuery } from '../../store/api/businessApi';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../../store/api/servicesApi';
import { PlusIcon, EditIcon, TrashIcon, LayersIcon } from '../../components/icons';
import { ServiceForm } from '../../components/onboarding/ServiceForm';
import { formatDuration, formatPrice } from '../../utils/format';
import { TOAST_DURATION } from '../../constants';
import type { Service, ServiceItem } from '../../types';

export function DashboardServices() {
  const toast = useToast();
  const { data: business, isLoading: isLoadingBusiness } = useGetMyBusinessQuery();
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleAddService = () => {
    setEditingService(null);
    openModal();
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    openModal();
  };

  const handleDeleteClick = (service: Service) => {
    setDeletingService(service);
    openDelete();
  };

  const handleSaveService = async (
    serviceData: Omit<ServiceItem, 'id'> & { id?: string }
  ) => {
    if (!business) return;

    try {
      if (editingService) {
        await updateService({
          id: editingService.id,
          name: serviceData.name,
          durationMinutes: serviceData.durationMinutes,
          price: serviceData.price,
          availableDays: serviceData.availableDays,
        }).unwrap();
        toast({
          title: 'Service updated',
          status: 'success',
          duration: TOAST_DURATION.MEDIUM,
        });
      } else {
        await createService({
          businessId: business.id,
          name: serviceData.name,
          durationMinutes: serviceData.durationMinutes,
          price: serviceData.price,
          availableDays: serviceData.availableDays,
        }).unwrap();
        toast({
          title: 'Service created',
          status: 'success',
          duration: TOAST_DURATION.MEDIUM,
        });
      }
      closeModal();
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingService) return;

    try {
      await deleteService(deletingService.id).unwrap();
      toast({
        title: 'Service deleted',
        status: 'success',
        duration: TOAST_DURATION.MEDIUM,
      });
      closeDelete();
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await updateService({
        id: service.id,
        isActive: !service.isActive,
      }).unwrap();
      toast({
        title: service.isActive ? 'Service hidden' : 'Service visible',
        status: 'success',
        duration: TOAST_DURATION.SHORT,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Could not update service.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  if (isLoadingBusiness || !business) {
    return (
      <Center py={12}>
        <Spinner size="lg" color="brand.500" />
      </Center>
    );
  }

  const services = business.services || [];

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="lg" color="gray.900" mb={1}>
            Services
          </Heading>
          <Text color="gray.500">Manage your service catalog</Text>
        </Box>
        <Button
          colorScheme="brand"
          leftIcon={<PlusIcon size={18} />}
          onClick={handleAddService}
        >
          Add Service
        </Button>
      </Flex>

      {services.length === 0 ? (
        <Box
          py={12}
          textAlign="center"
          bg="white"
          borderRadius="xl"
          border="1px"
          borderColor="gray.100"
        >
          <Box color="gray.300" display="inline-block" mb={3}>
            <LayersIcon size={48} />
          </Box>
          <Text color="gray.500" mb={4}>
            No services yet. Add your first service to start accepting bookings.
          </Text>
          <Button
            colorScheme="brand"
            leftIcon={<PlusIcon size={18} />}
            onClick={handleAddService}
          >
            Add Service
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => handleEditService(service)}
              onDelete={() => handleDeleteClick(service)}
              onToggleActive={() => handleToggleActive(service)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingService ? 'Edit Service' : 'Add Service'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {business.workingHours && (
              <ServiceForm
                initialValues={
                  editingService
                    ? {
                        id: String(editingService.id),
                        name: editingService.name,
                        durationMinutes: editingService.durationMinutes,
                        price: Number(editingService.price),
                        availableDays: editingService.availableDays,
                      }
                    : null
                }
                workingHours={business.workingHours}
                onSave={handleSaveService}
                onCancel={closeModal}
                isEditing={!!editingService}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="600">
              Delete Service
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{deletingService?.name}"? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={closeDelete}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

function ServiceCard({ service, onEdit, onDelete, onToggleActive }: ServiceCardProps) {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="gray.100"
      p={5}
      opacity={service.isActive ? 1 : 0.6}
      _hover={{ borderColor: 'gray.200' }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="flex-start" mb={3}>
        <Box flex={1}>
          <HStack spacing={2} mb={1}>
            <Text fontWeight="600" color="gray.900">
              {service.name}
            </Text>
            {!service.isActive && (
              <Badge colorScheme="gray" fontSize="xs">
                Hidden
              </Badge>
            )}
          </HStack>
          <Text fontSize="sm" color="gray.500">
            {formatDuration(service.durationMinutes)}
          </Text>
        </Box>
        <Text fontWeight="600" color="brand.600" fontSize="lg">
          {formatPrice(Number(service.price))}
        </Text>
      </Flex>

      <Flex justify="space-between" align="center" pt={3} borderTop="1px" borderColor="gray.100">
        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.500">
            Visible
          </Text>
          <Switch
            colorScheme="brand"
            size="sm"
            isChecked={service.isActive}
            onChange={onToggleActive}
          />
        </HStack>
        <HStack spacing={1}>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={onEdit}
          >
            <EditIcon size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={onDelete}
          >
            <TrashIcon size={16} />
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}

