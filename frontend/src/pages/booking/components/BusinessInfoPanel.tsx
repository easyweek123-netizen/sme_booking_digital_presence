import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
} from '@chakra-ui/react';
import { useState } from 'react';
import { PhoneIcon, MapPinIcon, InstagramIcon, GlobeIcon } from '../../../components/icons';
import { WorkingHoursSection } from './WorkingHoursSection';
import { BookingStatusCheck } from './BookingStatusCheck';
import type { BusinessWithServices } from '../../../types';

interface BusinessInfoPanelProps {
  business: BusinessWithServices;
}

export function BusinessInfoPanel({ business }: BusinessInfoPanelProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <VStack spacing={4} align="stretch">
      {/* Business Logo & Name */}
      <HStack spacing={4} align="center">
        {business.logoUrl && !logoError ? (
          <Box
            maxW="80px"
            maxH="80px"
            minW="60px"
            minH="60px"
            borderRadius="xl"
            overflow="hidden"
            bg="white"
            flexShrink={0}
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={1}
          >
            <Image
              src={business.logoUrl}
              alt={`${business.name} logo`}
              maxW="100%"
              maxH="100%"
              objectFit="contain"
              onError={() => setLogoError(true)}
            />
          </Box>
        ) : (
          <Box
            w="60px"
            h="60px"
            borderRadius="xl"
            bg={business.brandColor || 'brand.500'}
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="sm"
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              textTransform="uppercase"
            >
              {business.name.charAt(0)}
            </Text>
          </Box>
        )}

        <Box flex={1}>
          <Heading size="lg" color="gray.900" mb={1}>
            {business.name}
          </Heading>
          {business.description && (
            <Text color="gray.600" fontSize="sm" noOfLines={2}>
              {business.description}
            </Text>
          )}
        </Box>
      </HStack>

      {/* Contact & Social Info */}
      <HStack spacing={4} flexWrap="wrap">
        {business.city && (
          <HStack spacing={1.5} color="gray.600" fontSize="sm">
            <MapPinIcon size={15} />
            <Text>{business.city}</Text>
          </HStack>
        )}
        {business.phone && (
          <HStack
            as="a"
            href={`tel:${business.phone}`}
            spacing={1.5}
            color="gray.600"
            fontSize="sm"
            _hover={{ color: 'brand.600' }}
            transition="color 0.2s"
          >
            <PhoneIcon size={15} />
            <Text>{business.phone}</Text>
          </HStack>
        )}
        {business.instagram && (
          <HStack
            as="a"
            href={`https://instagram.com/${business.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            spacing={1.5}
            color="gray.600"
            fontSize="sm"
            _hover={{ color: 'brand.600' }}
            transition="color 0.2s"
          >
            <InstagramIcon size={15} />
            <Text>{business.instagram.startsWith('@') ? business.instagram : `@${business.instagram}`}</Text>
          </HStack>
        )}
        {business.website && (
          <HStack
            as="a"
            href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
            target="_blank"
            rel="noopener noreferrer"
            spacing={1.5}
            color="gray.600"
            fontSize="sm"
            _hover={{ color: 'brand.600' }}
            transition="color 0.2s"
          >
            <GlobeIcon size={15} />
            <Text>Website</Text>
          </HStack>
        )}
      </HStack>

      {/* Working Hours */}
      {business.workingHours && (
        <WorkingHoursSection workingHours={business.workingHours} />
      )}

      {/* Booking Status Check */}
      <BookingStatusCheck />
    </VStack>
  );
}

