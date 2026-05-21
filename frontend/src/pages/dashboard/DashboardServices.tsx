import {
  VStack,
  SimpleGrid,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  Heading,
  HStack,
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
import { CategoryManagement, ServiceCard, DashboardContentShell } from '../../components/Dashboard';
import { TOAST_DURATION } from '../../constants';
import type { Service } from '../../types';
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      })
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
    <DashboardContentShell
      title="Services"
      description="Manage your service catalog"
      actions={
        <Button variant="accent" leftIcon={<PlusIcon size={18} />} onClick={handleAddService}>
          Add Service
        </Button>
      }
    >
    <VStack spacing={6} align="stretch">
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
      <Modal isOpen={isModalOpen} onClose={closeModal} size="full" motionPreset="slideInBottom">
        <ModalOverlay bg="#0C0B10" />
        <ModalContent bg="#0C0B10" color="white" h="100vh" m={0} borderRadius={0} overflowY="auto">
          {/* Custom Salon Premium Header Bar */}
          <Flex
            justify="space-between"
            align="center"
            px={{ base: 6, md: 10 }}
            py={5}
            borderBottom="1px solid"
            borderColor="whiteAlpha.100"
            position="sticky"
            top={0}
            bg="#0C0B10"
            zIndex={20}
          >
            <Heading fontSize="2xl" fontWeight="700" color="white" letterSpacing="-0.01em">
              {editingService ? 'Edit service' : 'New service'}
            </Heading>
            <HStack spacing={3}>
              <Button
                variant="outline"
                borderColor="whiteAlpha.300"
                color="white"
                borderRadius="full"
                px={6}
                h="40px"
                fontSize="sm"
                fontWeight="700"
                _hover={{ bg: 'whiteAlpha.150', borderColor: 'whiteAlpha.400' }}
                _active={{ bg: 'whiteAlpha.200' }}
                onClick={closeModal}
              >
                Close
              </Button>
              <Button
                type="submit"
                form="service-form"
                isLoading={isSaving}
                bg="white"
                color="black"
                borderRadius="full"
                px={6}
                h="40px"
                fontSize="sm"
                fontWeight="700"
                _hover={{ bg: 'gray.200' }}
                _active={{ bg: 'gray.300', transform: 'scale(0.98)' }}
                transition="all 0.15s ease"
              >
                Save
              </Button>
            </HStack>
          </Flex>

          <ModalBody p={0} bg="#0C0B10">
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
                hideInlineActions
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
    </DashboardContentShell>
  );
}
