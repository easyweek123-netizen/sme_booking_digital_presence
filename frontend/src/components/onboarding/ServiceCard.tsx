import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { EditIcon, TrashIcon, ClockIcon } from '../icons';
import { SERVICE_DURATIONS, DAY_SHORT_LABELS, type DayOfWeek } from '../../constants';
import type { ServiceItem } from '../../types';

const MotionBox = motion.create(Box);

interface ServiceCardProps {
  service: ServiceItem;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}

export function ServiceCard({ service, onEdit, onDelete, index }: ServiceCardProps) {
  const durationLabel =
    SERVICE_DURATIONS.find((d) => d.value === service.durationMinutes)?.label ||
    `${service.durationMinutes} min`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getAvailabilityLabel = () => {
    if (!service.availableDays || service.availableDays.length === 0) {
      return 'All open days';
    }
    if (service.availableDays.length === 7) {
      return 'Every day';
    }
    return service.availableDays
      .map((day) => DAY_SHORT_LABELS[day as DayOfWeek])
      .join(', ');
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={4}
      _hover={{ borderColor: 'brand.200', boxShadow: 'sm', transition: 'all 0.2s' }}
    >
      <Flex justify="space-between" align="flex-start">
        <Box flex={1}>
          <Text fontWeight="600" fontSize="md" color="gray.900" mb={1}>
            {service.name}
          </Text>
          <HStack spacing={3} mb={2}>
            <Flex align="center" gap={1} color="gray.500">
              <ClockIcon size={14} />
              <Text fontSize="sm">{durationLabel}</Text>
            </Flex>
            <Text fontSize="lg" fontWeight="700" color="brand.500">
              {formatPrice(service.price)}
            </Text>
          </HStack>
          <Badge
            colorScheme="gray"
            variant="subtle"
            fontSize="xs"
            borderRadius="md"
            px={2}
            py={0.5}
          >
            {getAvailabilityLabel()}
          </Badge>
        </Box>
        <HStack spacing={1}>
          <IconButton
            aria-label="Edit service"
            icon={<EditIcon size={16} />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={onEdit}
            _hover={{ bg: 'gray.100' }}
          />
          <IconButton
            aria-label="Delete service"
            icon={<TrashIcon size={16} />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={onDelete}
            _hover={{ bg: 'red.50' }}
          />
        </HStack>
      </Flex>
    </MotionBox>
  );
}

