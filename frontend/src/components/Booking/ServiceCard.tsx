import { Box, Flex, Text, Button, Image, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { ChevronRightIcon } from '../icons';
import { formatDuration, formatPrice } from '../../utils/format';
import type { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  brandColor?: string | null;
  onBook: () => void;
}

// Character threshold for "See more"
const DESCRIPTION_THRESHOLD = 80;

export function ServiceCard({ service, brandColor, onBook }: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasImage = service.imageUrl && !imageError;

  // Get initial for fallback
  const initial = service.name.charAt(0).toUpperCase();
  const fallbackBg = brandColor || '#4A7C59';

  // Check if description needs truncation
  const description = service.description || '';
  const needsTruncation = description.length > DESCRIPTION_THRESHOLD;
  const displayDescription = isExpanded || !needsTruncation 
    ? description 
    : description.slice(0, DESCRIPTION_THRESHOLD).trim() + '...';

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="xl"
      border="1px"
      borderColor="gray.100"
      _hover={{ borderColor: 'brand.200', boxShadow: 'sm' }}
      transition="all 0.2s"
    >
      <Flex gap={4}>
        {/* Service Image/Icon */}
        <Box
          w="72px"
          h="72px"
          minW="72px"
          borderRadius="lg"
          overflow="hidden"
          bg={hasImage ? 'gray.100' : fallbackBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
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
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="white"
            >
              {initial}
            </Text>
          )}
        </Box>

        {/* Service Info */}
        <Flex flex={1} direction="column" justify="space-between" minW={0}>
          <Box>
            <Text fontWeight="600" color="gray.900" fontSize="md" noOfLines={1}>
              {service.name}
            </Text>
            {description && (
              <Text color="gray.500" fontSize="sm" mt={0.5}>
                {displayDescription}
                {needsTruncation && (
                  <Link
                    as="button"
                    color={brandColor || 'brand.500'}
                    fontWeight="500"
                    fontSize="sm"
                    ml={1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {isExpanded ? 'See less' : 'See more'}
                  </Link>
                )}
              </Text>
            )}
          </Box>

          <Flex justify="space-between" align="center" mt={2}>
            <Text color="gray.500" fontSize="sm">
              {formatDuration(service.durationMinutes)} · {formatPrice(Number(service.price))}
            </Text>
            <Button
              size="sm"
              colorScheme="brand"
              onClick={onBook}
              rightIcon={<ChevronRightIcon size={14} />}
            >
              Book
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

