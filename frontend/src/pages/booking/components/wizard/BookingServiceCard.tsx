import { Box, Flex, Text, HStack, Image } from '@chakra-ui/react';
import { useState } from 'react';
import { ClockIcon } from '../../../../components/icons';
import { formatDuration, formatPrice } from '../../../../utils/format';
import type { Service } from '../../../../types';

interface Props {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
}

export function BookingServiceCard({ service, isSelected, onSelect }: Props) {
  const [imageError, setImageError] = useState(false);
  const hasImage = service.imageUrl && !imageError;
  const initial = service.name.charAt(0).toUpperCase() || '?';

  return (
    <Box
      as="button"
      type="button"
      onClick={onSelect}
      textAlign="left"
      w="100%"
      p={{ base: 4 }}
      bg="surface.card"
      border={isSelected ? '2px solid' : '1px solid'}
      borderColor={isSelected ? 'brand.500' : 'border.subtle'}
      borderRadius="xl"
      transition="border-color 0.15s ease, box-shadow 0.2s ease, transform 0.2s ease"
      _hover={{
        borderColor: isSelected ? 'brand.500' : 'border.strong',
        boxShadow: 'md',
        transform: 'translateY(-1px)',
      }}
      cursor="pointer"
    >
      <Flex align="start" gap={4}>
        <Box
          w="56px"
          h="56px"
          minW="56px"
          borderRadius="lg"
          overflow="hidden"
          bg={hasImage ? 'gray.100' : 'brand.500'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {hasImage ? (
            <Image
              src={service.imageUrl!}
              alt={service.name}
              w="100%"
              h="100%"
              objectFit="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Text fontSize="xl" fontWeight="bold" color="white">
              {initial}
            </Text>
          )}
        </Box>

        <Box flex={1} minW={0}>
          <Flex justify="space-between" align="start" gap={2} mb={2}>
            <Text fontWeight="600" fontSize="md" color="text.heading" noOfLines={1}>
              {service.name}
            </Text>
            <Text fontWeight="600" fontSize="md" color="text.heading" flexShrink={0}>
              {formatPrice(Number(service.price))}
            </Text>
          </Flex>
          {service.description && (
            <Text fontSize="sm" color="text.muted" noOfLines={2} mb={3}>
              {service.description}
            </Text>
          )}
          <Flex justify="space-between" align="center">
            <HStack spacing={1.5} color="text.muted" fontSize="sm">
              <ClockIcon size={14} />
              <Text>{formatDuration(service.durationMinutes)}</Text>
            </HStack>
            <Text fontSize="sm" fontWeight="600" color={isSelected ? 'brand.500' : 'text.primary'}>
              {isSelected ? 'Selected ✓' : 'Select →'}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
