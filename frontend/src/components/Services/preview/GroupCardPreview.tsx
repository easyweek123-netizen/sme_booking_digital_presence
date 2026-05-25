import { Box, Button, HStack, Image, Tag, Text, VStack } from '@chakra-ui/react';
import { ClockIcon, UsersIcon } from '../../icons';
import type { ServiceDraft } from './AppointmentCardPreview';
import { STRIPE_BG, formatPrice, classTimeLabels } from './helpers';
import { LocationChip } from './LocationChip';

interface GroupCardPreviewProps {
  draft: ServiceDraft;
}

export function GroupCardPreview({ draft }: GroupCardPreviewProps) {
  const times = classTimeLabels(draft.availability);
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
            <Tag size="sm" variant="subtle" colorScheme="purple">
              <HStack spacing={1}>
                <UsersIcon size={12} />
                <Text>Group</Text>
              </HStack>
            </Tag>
            <LocationChip type={draft.locationType} />
          </HStack>
          <Text fontWeight="700" fontSize="md" color="text.heading">
            {draft.name?.trim() || 'Class name'}
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
              <UsersIcon size={14} />
              <Text fontSize="sm">{draft.capacity ?? 0} spots</Text>
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

      {times.length > 0 && (
        <HStack
          mt={3}
          pt={3}
          borderTopWidth={1}
          borderColor="border.subtle"
          spacing={2}
          wrap="wrap"
        >
          {times.slice(0, 3).map((t) => (
            <Tag key={t} size="sm" variant="subtle" colorScheme="gray">
              <Text fontSize="xs">{t}</Text>
            </Tag>
          ))}
          {times.length > 3 && (
            <Text fontSize="xs" color="text.muted">
              +{times.length - 3} more
            </Text>
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
      )}
    </Box>
  );
}
