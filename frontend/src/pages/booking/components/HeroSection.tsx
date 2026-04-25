import { Box, Container, Heading, Text, Image, HStack, Button, useToken } from '@chakra-ui/react';
import { useState } from 'react';
import { ClockIcon, MapPinIcon } from '../../../components/icons';
import type { BusinessWithServices, WorkingHours } from '../../../types';
import { DAYS_OF_WEEK, formatTime } from '../../../constants';

interface HeroSectionProps {
  business: BusinessWithServices;
  onBookNow: () => void;
}

/**
 * Returns today's open/close status string based on working hours.
 */
function getTodayStatus(workingHours: WorkingHours | null): string {
  if (!workingHours) return '';
  const dayIndex = new Date().getDay();
  // JS getDay(): 0=Sun, our array: 0=Mon → map accordingly
  const dayKey = DAYS_OF_WEEK[dayIndex === 0 ? 6 : dayIndex - 1];
  const schedule = workingHours[dayKey];
  if (!schedule?.isOpen) return 'Closed today';
  return `Open today · ${formatTime(schedule.openTime)} – ${formatTime(schedule.closeTime)}`;
}

export function HeroSection({ business, onBookNow }: HeroSectionProps) {
  const [coverError, setCoverError] = useState(false);
  const hasCoverImage = business.coverImageUrl && !coverError;
  const [defaultBrandColor] = useToken('colors', ['brand.500']);
  const brandColor = business.brandColor || defaultBrandColor;

  const todayStatus = getTodayStatus(business.workingHours);

  return (
    <Box position="relative" overflow="hidden">
      {/* Background */}
      <Box
        position="absolute"
        inset={0}
        bg={
          hasCoverImage
            ? `url(${business.coverImageUrl})`
            : `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}CC 40%, ${brandColor}99 100%)`
        }
        bgSize="cover"
        bgPosition="center"
        _after={{
          content: '""',
          position: 'absolute',
          inset: 0,
          bgGradient: hasCoverImage ? 'linear(to-b, blackAlpha.300, blackAlpha.600)' : undefined,
          display: hasCoverImage ? 'block' : 'none',
        }}
      >
        {hasCoverImage && (
          <Image
            src={business.coverImageUrl!}
            alt=""
            w="100%"
            h="100%"
            objectFit="cover"
            onError={() => setCoverError(true)}
            display="none" /* Preload for error detection */
          />
        )}
      </Box>

      {/* Content */}
      <Container maxW="600px" position="relative" zIndex={1} py={{ base: 12, md: 16 }} px={6}>
        <Box textAlign="center">
          {/* Logo */}
          {business.logoUrl ? (
            <Box
              mx="auto"
              mb={5}
              w="80px"
              h="80px"
              borderRadius="2xl"
              overflow="hidden"
              bg="surface.card"
              boxShadow="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={1.5}
            >
              <Image
                src={business.logoUrl}
                alt={`${business.name} logo`}
                maxW="100%"
                maxH="100%"
                objectFit="contain"
              />
            </Box>
          ) : (
            <Box
              mx="auto"
              mb={5}
              w="80px"
              h="80px"
              borderRadius="2xl"
              bg="whiteAlpha.200"
              backdropFilter="blur(8px)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="lg"
            >
              <Text fontSize="3xl" fontWeight="bold" color="white">
                {business.name.charAt(0).toUpperCase()}
              </Text>
            </Box>
          )}

          {/* Name */}
          <Heading
            size={{ base: 'xl', md: '2xl' }}
            color={hasCoverImage ? 'white' : 'white'}
            mb={2}
            letterSpacing="-0.02em"
          >
            {business.name}
          </Heading>

          {/* Description */}
          {business.description && (
            <Text
              color={hasCoverImage ? 'whiteAlpha.900' : 'whiteAlpha.800'}
              fontSize={{ base: 'md', md: 'lg' }}
              maxW="480px"
              mx="auto"
              mb={5}
              lineHeight="tall"
            >
              {business.description}
            </Text>
          )}

          {/* Status & Location */}
          <HStack spacing={4} justify="center" mb={6} flexWrap="wrap">
            {todayStatus && (
              <HStack
                spacing={1.5}
                color={hasCoverImage ? 'whiteAlpha.900' : 'whiteAlpha.800'}
                fontSize="sm"
              >
                <ClockIcon size={14} />
                <Text>{todayStatus}</Text>
              </HStack>
            )}
            {business.city && (
              <HStack
                spacing={1.5}
                color={hasCoverImage ? 'whiteAlpha.900' : 'whiteAlpha.800'}
                fontSize="sm"
              >
                <MapPinIcon size={14} />
                <Text>{business.city}</Text>
              </HStack>
            )}
          </HStack>

          {/* CTA */}
          <Button
            size="lg"
            bg="surface.card"
            color="text.heading"
            fontWeight="600"
            borderRadius="full"
            px={8}
            _hover={{ bg: 'surface.page', transform: 'translateY(-1px)' }}
            _active={{ bg: 'gray.200' }}
            transition="all 0.2s"
            boxShadow="md"
            onClick={onBookNow}
          >
            Book Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
