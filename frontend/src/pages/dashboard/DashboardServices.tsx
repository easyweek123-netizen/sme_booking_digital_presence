import {
  VStack,
  SimpleGrid,
  Button,
  useToast,
  useDisclosure,
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
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../../contexts/useBusiness';
import { useUpdateServiceMutation, useDeleteServiceMutation } from '../../store/api/servicesApi';
import { PlusIcon, LayersIcon } from '../../components/icons';
import { CategoryManagement, ServiceCard, DashboardContentShell } from '../../components/Dashboard';
import { TOAST_DURATION } from '../../constants';
import { ROUTES } from '../../config/routes';
import type { Service } from '../../types';
import { EmptyState } from '../../components/ui/states';

export function DashboardServices() {
  const navigate = useNavigate();
  const toast = useToast();
  const business = useBusiness();
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const [updateService] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleDeleteClick = (service: Service) => {
    setDeletingService(service);
    openDelete();
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
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await updateService({
        id: service.id,
        data: { isActive: !service.isActive },
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
        <Button
          colorScheme="brand"
          leftIcon={<PlusIcon size={14} />}
          onClick={() => navigate(ROUTES.DASHBOARD.SERVICES_CREATE)}
        >
          New service
        </Button>
      }
    >
      <VStack spacing={6} align="stretch">
        <CategoryManagement businessId={business.id} />

        {services.length === 0 ? (
          <EmptyState
            icon={<LayersIcon size={28} />}
            title="No services yet"
            description="Add your first service to start accepting bookings."
            action={{
              label: 'New service',
              onClick: () => navigate(ROUTES.DASHBOARD.SERVICES_CREATE),
              variant: 'solid',
            }}
          />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={{
                  id: service.id,
                  name: service.name,
                  price: Number(service.price) || 0,
                  durationMinutes: service.durationMinutes,
                  description: service.description,
                  isActive: service.isActive,
                  imageUrl: service.photoUrl,
                }}
                onEdit={() => navigate(ROUTES.DASHBOARD.SERVICE_EDIT(service.id))}
                onDelete={() => handleDeleteClick(service)}
                onToggleActive={() => handleToggleActive(service)}
              />
            ))}
          </SimpleGrid>
        )}

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
                Are you sure you want to delete &quot;{deletingService?.name}&quot;? If this
                service has existing bookings, it will be archived (hidden from your booking page)
                to preserve booking history. Otherwise it will be permanently removed.
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
