import {
  Box,
  HStack,
  Text,
  Button,
  Switch,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { EditIcon, TrashIcon } from '../icons';
import { formatDuration, formatPrice } from '../../utils/format';

/**
 * Base service data required for display
 * Compatible with both Service and ServiceListItem types
 */
interface ServiceDisplayData {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
  description?: string | null;
  isActive?: boolean;
  imageUrl?: string | null;
}

interface ServiceCardProps {
  service: ServiceDisplayData;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
  showActions?: boolean;
}

export function ServiceCard({
  service,
  onEdit,
  onDelete,
  onToggleActive,
  showActions = true,
}: ServiceCardProps) {
  const hasActions = showActions && (onEdit || onDelete || onToggleActive);

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="gray.100"
      overflow="hidden"
      opacity={service.isActive !== false ? 1 : 0.6}
      _hover={{ borderColor: 'gray.200' }}
      transition="all 0.2s"
    >
      {/* Service Image */}
      {service.imageUrl && (
        <Box h="100px" overflow="hidden" borderBottom="1px" borderColor="gray.100">
          <Box
            h="100%"
            bgImage={`url(${service.imageUrl})`}
            bgSize="cover"
            bgPosition="center"
          />
        </Box>
      )}

      <Box p={5}>
        <Flex justify="space-between" align="flex-start" mb={2}>
          <Box flex={1}>
            <HStack spacing={2} mb={1}>
              <Text fontWeight="600" color="gray.900">
                {service.name}
              </Text>
              {service.isActive === false && (
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

        {/* Description */}
        {service.description && (
          <Text fontSize="sm" color="gray.500" noOfLines={2} mb={hasActions ? 2 : 0}>
            {service.description}
          </Text>
        )}

        {/* Action Footer - only show when actions are enabled */}
        {hasActions && (
          <Flex justify="space-between" align="center" pt={3} borderTop="1px" borderColor="gray.100">
            {onToggleActive ? (
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
            ) : (
              <Box />
            )}
            <HStack spacing={1}>
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  onClick={onEdit}
                >
                  <EditIcon size={16} />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={onDelete}
                >
                  <TrashIcon size={16} />
                </Button>
              )}
            </HStack>
          </Flex>
        )}
      </Box>
    </Box>
  );
}

