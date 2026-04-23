import {
  VStack,
  SimpleGrid,
  Button,
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
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useBusiness } from '../../contexts/useBusiness';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../../store/api/servicesApi';
import { PlusIcon, LayersIcon } from '../../components/icons';
import { ServiceForm, type ServiceFormData } from '../../components/onboarding/ServiceForm';
import { CategoryManagement, ServiceCard } from '../../components/Dashboard';
import { TOAST_DURATION } from '../../constants';
import type { Service } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/states';

export function DashboardServices() {
  const toast = useToast();
  const business = useBusiness();
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const isSaving = isCreating || isUpdating;

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

  const handleSaveService = async (serviceData: ServiceFormData) => {
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
        title: 'Service removed',
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

  const services = business.services || [];

  return (
    <VStack spacing={6} align="stretch">
      <PageHeader
        title="Services"
        description="Manage your service catalog"
        actions={
          <Button leftIcon={<PlusIcon size={18} />} onClick={handleAddService}>
            Add Service
          </Button>
        }
      />

      {/* Category Management */}
      <CategoryManagement businessId={business.id} />

      {services.length === 0 ? (
        <EmptyState
          icon={<LayersIcon size={28} />}
          title="No services yet"
          description="Add your first service to start accepting bookings."
          action={{ label: 'Add Service', onClick: handleAddService, variant: 'solid' }}
        />
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
                onSubmit={handleSaveService}
                onCancel={closeModal}
                moreOptionsExpanded
                isLoading={isSaving}
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
              Are you sure you want to delete "{deletingService?.name}"?
              {' '}If this service has existing bookings, it will be archived
              (hidden from your booking page) to preserve booking history.
              Otherwise it will be permanently removed.
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={closeDelete}>
                Cancel
              </Button>
              <Button
                colorScheme="alert"
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
