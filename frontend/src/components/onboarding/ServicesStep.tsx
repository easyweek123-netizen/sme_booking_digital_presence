import { useState } from 'react';
import {
  Box,
  VStack,
  Button,
  Text,
  Heading,
  Flex,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '../icons';
import { ServiceCard } from './ServiceCard';
import { ServiceForm, type ServiceFormData } from './ServiceForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addService,
  updateService,
  removeService,
  defaultWorkingHours,
} from '../../store/slices/onboardingSlice';
import type { ServiceItem } from '../../types';

const MotionBox = motion.create(Box);

export function ServicesStep() {
  const dispatch = useAppDispatch();
  const { services, businessProfile } = useAppSelector((state) => state.onboarding);
  
  // Show form by default if no services yet (open by default behavior)
  const [showForm, setShowForm] = useState(services.length === 0);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const workingHours = businessProfile?.workingHours || defaultWorkingHours;

  const handleAddService = (data: ServiceFormData) => {
    const newService: ServiceItem = {
      id: `temp-${Date.now()}`,
      name: data.name,
      price: data.price,
      durationMinutes: data.durationMinutes,
      availableDays: data.availableDays ?? null,
    };
    dispatch(addService(newService));
    setShowForm(false);
  };

  const handleUpdateService = (data: ServiceFormData) => {
    if (data.id) {
      const service: ServiceItem = {
        id: data.id,
        name: data.name,
        price: data.price,
        durationMinutes: data.durationMinutes,
        availableDays: data.availableDays ?? null,
      };
      dispatch(updateService({ id: data.id, service }));
    }
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    dispatch(removeService(id));
  };

  const handleEditClick = (service: ServiceItem) => {
    setEditingService(service);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <VStack spacing={5} align="stretch">
        {/* Header */}
        <Box textAlign="center" mb={2}>
          <Heading size="lg" color="gray.900" mb={2}>
            Your Services
          </Heading>
          <Text color="gray.600">
            Add services you offer, or skip for now and add them later
          </Text>
        </Box>

        {/* Services List */}
        <VStack spacing={3} align="stretch">
          <AnimatePresence mode="popLayout">
            {services.map((service, index) => (
              <Box key={service.id}>
                {editingService?.id === service.id ? (
                  <ServiceForm
                    initialValues={service}
                    workingHours={workingHours}
                    onSubmit={handleUpdateService}
                    onCancel={handleCancel}
                  />
                ) : (
                  <ServiceCard
                    service={service}
                    onEdit={() => handleEditClick(service)}
                    onDelete={() => handleDeleteService(service.id)}
                    index={index}
                  />
                )}
              </Box>
            ))}
          </AnimatePresence>
        </VStack>

        {/* Add Service Form or Button */}
        <AnimatePresence mode="wait">
          {showForm ? (
            <ServiceForm
              workingHours={workingHours}
              onSubmit={handleAddService}
              onCancel={handleCancel}
            />
          ) : !editingService && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                variant="outline"
                colorScheme="brand"
                size="lg"
                w="full"
                borderRadius="xl"
                borderStyle="dashed"
                borderWidth="2px"
                py={8}
                onClick={() => setShowForm(true)}
                _hover={{ bg: 'brand.50' }}
              >
                <Flex align="center" gap={2}>
                  <PlusIcon size={20} />
                  <Text>Add Service</Text>
                </Flex>
              </Button>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Optional services hint */}
        {services.length === 0 && !showForm && (
          <Alert status="info" borderRadius="lg" bg="blue.50">
            <AlertIcon color="blue.500" />
            <Text fontSize="sm" color="blue.700">
              You can add services now or skip and add them later from your dashboard
            </Text>
          </Alert>
        )}
      </VStack>
    </MotionBox>
  );
}

