import {
  Box,
  VStack,
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
  Flex,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useGetMyBusinessQuery } from '../../store/api/businessApi';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../../store/api/servicesApi';
import { PlusIcon, LayersIcon } from '../../components/icons';
import { ServiceForm } from '../../components/onboarding/ServiceForm';
import { CategoryManagement, ServiceCard } from '../../components/Dashboard';
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
    serviceData: Omit<ServiceItem, 'id'> & { id?: string; description?: string; imageUrl?: string; categoryId?: number | null }
  ) => {
    if (!business) return;

    try {
      if (editingService) {
        await updateService({
          id: editingService.id,
          name: serviceData.name,
          description: serviceData.description,
          durationMinutes: serviceData.durationMinutes,
          price: serviceData.price,
          availableDays: serviceData.availableDays,
          imageUrl: serviceData.imageUrl,
          categoryId: serviceData.categoryId,
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
          description: serviceData.description,
          durationMinutes: serviceData.durationMinutes,
          price: serviceData.price,
          availableDays: serviceData.availableDays,
          imageUrl: serviceData.imageUrl,
          categoryId: serviceData.categoryId,
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

      {/* Category Management */}
      <CategoryManagement businessId={business.id} />

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
                        description: editingService.description || '',
                        durationMinutes: editingService.durationMinutes,
                        price: Number(editingService.price),
                        availableDays: editingService.availableDays,
                        imageUrl: editingService.imageUrl || '',
                        categoryId: editingService.categoryId,
                      }
                    : null
                }
                businessId={business.id}
                workingHours={business.workingHours}
                onSave={handleSaveService}
                onCancel={closeModal}
                isEditing={!!editingService}
                showExtendedFields={true}
                extendedFieldsExpanded={true}
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

