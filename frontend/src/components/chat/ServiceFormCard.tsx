import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../../store/api';
import type { ServiceFormData } from '../../types/chat.types';

const MotionBox = motion.create(Box);

interface ServiceFormCardProps {
  operation: 'create' | 'update' | 'delete';
  businessId?: number;
  serviceId?: number;
  initialData: ServiceFormData;
  onComplete?: () => void;
}

export function ServiceFormCard({
  operation,
  businessId,
  serviceId,
  initialData,
  onComplete,
}: ServiceFormCardProps) {
  const toast = useToast();
  const [formData, setFormData] = useState<ServiceFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const handleChange = (field: keyof ServiceFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (operation === 'create' && businessId) {
        await createService({
          businessId,
          name: formData.name || '',
          price: formData.price || 0,
          durationMinutes: formData.durationMinutes || 30,
          description: formData.description,
        }).unwrap();
        toast({
          title: 'Service created!',
          description: `${formData.name} has been added.`,
          status: 'success',
          duration: 3000,
        });
      } else if (operation === 'update' && serviceId) {
        await updateService({
          id: serviceId,
          name: formData.name,
          price: formData.price,
          durationMinutes: formData.durationMinutes,
          description: formData.description,
        }).unwrap();
        toast({
          title: 'Service updated!',
          status: 'success',
          duration: 3000,
        });
      } else if (operation === 'delete' && serviceId) {
        await deleteService(serviceId).unwrap();
        toast({
          title: 'Service deleted',
          status: 'info',
          duration: 3000,
        });
      }
      onComplete?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete confirmation view
  if (operation === 'delete') {
    return (
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="red.200"
        p={4}
        mt={3}
        maxW="320px"
      >
        <VStack spacing={3} align="stretch">
          <Text fontWeight="600" color="red.600">
            Delete Service
          </Text>
          <Text fontSize="sm" color="gray.600">
            Are you sure you want to delete "{initialData.name}"?
          </Text>
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme="red"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              flex={1}
            >
              Delete
            </Button>
            <Button size="sm" variant="outline" onClick={onComplete} flex={1}>
              Cancel
            </Button>
          </HStack>
        </VStack>
      </MotionBox>
    );
  }

  // Create/Update form
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="brand.200"
      p={4}
      mt={3}
      maxW="320px"
    >
      <VStack spacing={3} align="stretch">
        <Text fontWeight="600" color="brand.600">
          {operation === 'create' ? 'New Service' : 'Update Service'}
        </Text>

        <FormControl size="sm">
          <FormLabel fontSize="xs" color="gray.500" mb={1}>
            Name
          </FormLabel>
          <Input
            size="sm"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Haircut"
          />
        </FormControl>

        <HStack spacing={3}>
          <FormControl size="sm">
            <FormLabel fontSize="xs" color="gray.500" mb={1}>
              Price ($)
            </FormLabel>
            <Input
              size="sm"
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
              placeholder="30"
            />
          </FormControl>

          <FormControl size="sm">
            <FormLabel fontSize="xs" color="gray.500" mb={1}>
              Duration (min)
            </FormLabel>
            <Input
              size="sm"
              type="number"
              value={formData.durationMinutes || ''}
              onChange={(e) => handleChange('durationMinutes', parseInt(e.target.value) || 30)}
              placeholder="45"
            />
          </FormControl>
        </HStack>

        <FormControl size="sm">
          <FormLabel fontSize="xs" color="gray.500" mb={1}>
            Description (optional)
          </FormLabel>
          <Textarea
            size="sm"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description..."
            rows={2}
          />
        </FormControl>

        <HStack spacing={2} pt={1}>
          <Button
            size="sm"
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            flex={1}
          >
            {operation === 'create' ? 'Create' : 'Update'}
          </Button>
          <Button size="sm" variant="outline" onClick={onComplete} flex={1}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    </MotionBox>
  );
}

