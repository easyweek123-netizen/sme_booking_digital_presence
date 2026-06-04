import { Box, Button, HStack, Image, Tag, Text, VStack } from '@chakra-ui/react';
import { ClockIcon, UserIcon } from '../../icons';
import type {
  ServiceTypeValue,
  PriceTypeValue,
  AvailabilityInput,
} from '../../../types';
import type { LocationType } from '../../../types/location';
import { STRIPE_BG, formatPrice, recurringDayLabels } from './helpers';
import { LocationChip } from './LocationChip';

export interface ServiceDraft {
  type?: ServiceTypeValue;
  name?: string;
  description?: string | null;
  capacity?: number;
  durationMinutes?: number;
  price?: string | null;
  priceType?: PriceTypeValue;
  activeLocationKind?: LocationType | null;
  color?: string | null;
  photoUrl?: string | null;
  availability?: AvailabilityInput[];
}

function TypeChip({ type }: { type?: ServiceTypeValue }) {
  if (!type) return null;
  const label = type === 'APPOINTMENT' ? 'Appointment' : 'Group';
  return (
    <Tag size="sm" variant="subtle" colorScheme="purple">
      <HStack spacing={1}>
        <UserIcon size={12} />
        <Text>{label}</Text>
      </HStack>
    </Tag>
  );
}

interface AppointmentCardPreviewProps {
  draft: ServiceDraft;
}

export function AppointmentCardPreview({ draft }: AppointmentCardPreviewProps) {
  const days = recurringDayLabels(draft.availability);

  return (
    <Box
      borderRadius="lg"
      borderWidth={1}
      borderColor="border.subtle"
      bg="surface.card"
      p={4}
    >
      <HStack spacing={4} align="flex-start">
        <Box
          w="84px"
          h="84px"
          borderRadius="md"
          overflow="hidden"
          background={draft.photoUrl ? undefined : STRIPE_BG}
          flexShrink={0}
        >
          {draft.photoUrl ? (
            <Image src={draft.photoUrl} alt="" objectFit="cover" w="100%" h="100%" />
          ) : (
            <Box
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontSize="xs"
                fontWeight="600"
                color="text.muted"
                letterSpacing="wider"
              >
                COVER
              </Text>
            </Box>
          )}
        </Box>
        <VStack align="stretch" spacing={2} flex={1} minW={0}>
          <HStack spacing={2} wrap="wrap">
            <TypeChip type={draft.type} />
            <LocationChip type={draft.activeLocationKind ?? undefined} />
          </HStack>
          <Text fontWeight="700" fontSize="md" color="text.heading">
            {draft.name?.trim() || 'Service name'}
          </Text>
          {draft.description && (
            <Text fontSize="sm" color="text.secondary" noOfLines={2}>
              {draft.description}
            </Text>
          )}
          <HStack spacing={4}>
            <HStack spacing={1} color="text.muted">
              <ClockIcon size={14} />
              <Text fontSize="sm">{draft.durationMinutes ?? '—'} min</Text>
            </HStack>
            <HStack spacing={1} color="text.muted">
              <UserIcon size={14} />
              <Text fontSize="sm">
                {draft.capacity && draft.capacity > 1
                  ? `${draft.capacity} spots`
                  : '1 spot'}
              </Text>
            </HStack>
            <Box flex={1} />
            <Tag size="md" variant="subtle" colorScheme="purple">
              <Text fontWeight="600">
                {formatPrice(draft.price, draft.priceType)}
              </Text>
            </Tag>
          </HStack>
        </VStack>
      </HStack>

      <HStack
        mt={3}
        pt={3}
        borderTopWidth={1}
        borderColor="border.subtle"
        spacing={3}
        wrap="wrap"
      >
        {days.length > 0 && (
          <Tag size="sm" variant="subtle" colorScheme="gray">
            <Text fontSize="xs">{days.join(' · ')}</Text>
          </Tag>
        )}
        <Box flex={1} />
        <Button
          size="sm"
          bg={draft.color ?? 'brand.500'}
          color="white"
          _hover={{ opacity: 0.9 }}
          rightIcon={<Text>›</Text>}
        >
          Book
        </Button>
      </HStack>
    </Box>
  );
}
