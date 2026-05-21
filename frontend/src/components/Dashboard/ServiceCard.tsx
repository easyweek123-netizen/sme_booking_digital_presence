import {
  Box,
  HStack,
  Text,
  Switch,
  Flex,
  Badge,
  IconButton,
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

// Generate beautiful, tailored pastel gradients matching BookEasy's warm Limepay color palette
function getServiceGradient(name: string) {
  const gradientPairs = [
    ['#F3EEFC', '#E7DDF8'], // Brand Soft Purple
    ['#FDF2EE', '#FBE4DA'], // Coral Soft Warm
    ['#F2F7F0', '#E7F0E3'], // Sage Soft Olive
    ['#FDF6E9', '#FBEEDD'], // Amber Soft Gold
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pair = gradientPairs[hash % gradientPairs.length];
  return `linear-gradient(135deg, ${pair[0]} 0%, ${pair[1]} 100%)`;
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
      bg="surface.card"
      borderRadius="lg"
      border="1px solid"
      borderColor="border.subtle"
      overflow="hidden"
      opacity={service.isActive !== false ? 1 : 0.7}
      boxShadow="sm"
      _hover={{
        borderColor: 'brand.300',
        boxShadow: 'card',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
      position="relative"
    >
      {/* Service Image / Beautiful Custom Gradient Placeholder */}
      <Box h="110px" overflow="hidden" borderBottom="1px solid" borderColor="border.subtle" position="relative">
        {service.imageUrl ? (
          <Box
            h="100%"
            bgImage={`url(${service.imageUrl})`}
            bgSize="cover"
            bgPosition="center"
            transition="transform 0.5s ease"
            _hover={{ transform: 'scale(1.05)' }}
          />
        ) : (
          <Flex
            h="100%"
            bg={getServiceGradient(service.name)}
            align="center"
            justify="center"
            position="relative"
          >
            <Text
              fontSize="3xl"
              fontWeight="700"
              color="brand.400"
              opacity={0.3}
              userSelect="none"
            >
              {service.name.charAt(0).toUpperCase()}
            </Text>
          </Flex>
        )}
        
        {/* Floating Status Indicator */}
        {service.isActive === false && (
          <Box position="absolute" top={3} right={3}>
            <Badge colorScheme="gray" variant="solid" bg="gray.600" color="white" borderRadius="sm" px={2} py={0.5}>
              Hidden
            </Badge>
          </Box>
        )}
      </Box>

      {/* Card Content Panel */}
      <Box p={5}>
        <Flex justify="space-between" align="flex-start" mb={3}>
          <Box flex={1} pr={2}>
            <Text fontWeight="600" color="text.heading" fontSize="md" mb={1} noOfLines={1}>
              {service.name}
            </Text>
            <Text fontSize="xs" color="text.muted" fontWeight="500">
              {formatDuration(service.durationMinutes)}
            </Text>
          </Box>
          <Text fontWeight="600" color="gray.800" fontSize="sm" bg="gray.50" px={2.5} py={1} borderRadius="sm" border="1px solid" borderColor="gray.200" flexShrink={0}>
            {formatPrice(Number(service.price))}
          </Text>
        </Flex>

        {/* Service Description block */}
        {service.description ? (
          <Text fontSize="xs" color="text.secondary" noOfLines={2} minH="34px" mb={hasActions ? 3 : 0} lineHeight="relaxed">
            {service.description}
          </Text>
        ) : (
          <Text fontSize="xs" color="text.faint" fontStyle="italic" noOfLines={2} minH="34px" mb={hasActions ? 3 : 0} lineHeight="relaxed">
            No description provided.
          </Text>
        )}

        {/* Action Footer - visible when operations permitted */}
        {hasActions && (
          <Flex justify="space-between" align="center" pt={3} borderTop="1px solid" borderColor="border.subtle">
            {onToggleActive ? (
              <HStack spacing={2}>
                <Text fontSize="xs" color="text.muted" fontWeight="500">
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
                <IconButton
                  aria-label="Edit service"
                  icon={<EditIcon size={14} />}
                  size="sm"
                  variant="ghost"
                  color="text.secondary"
                  onClick={onEdit}
                  borderRadius="sm"
                  _hover={{ bg: 'gray.100', color: 'text.primary' }}
                />
              )}
              {onDelete && (
                <IconButton
                  aria-label="Delete service"
                  icon={<TrashIcon size={14} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  color="danger.primary"
                  onClick={onDelete}
                  borderRadius="sm"
                  _hover={{ bg: 'danger.soft', color: 'danger.primary' }}
                />
              )}
            </HStack>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
