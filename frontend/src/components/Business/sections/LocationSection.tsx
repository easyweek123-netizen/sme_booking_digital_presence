import { Box, HStack, Link, Text } from '@chakra-ui/react';
import { MapPinIcon } from '../../icons';
import { SectionHeading } from '../SectionHeading';

interface LocationSectionProps {
  address: string | null;
  city: string | null;
}

export function LocationSection({ address, city }: LocationSectionProps) {
  if (!address && !city) return null;
  const q = encodeURIComponent([address, city].filter(Boolean).join(', '));
  return (
    <Box as="section" pt={8}>
      <SectionHeading id="section-location">Location</SectionHeading>
      <HStack justify="space-between" mb={3} gap={3}>
        <HStack color="gray.700" fontSize="sm" spacing={2}>
          <MapPinIcon size={16} />
          <Text as="span">{[address, city].filter(Boolean).join(', ')}</Text>
        </HStack>
        <Link
          href={`https://maps.google.com/?q=${q}`}
          isExternal
          color="var(--brand-accent)"
          fontWeight={600}
          fontSize="sm"
        >
          Get directions
        </Link>
      </HStack>
      <Box h="240px" borderRadius="14px" overflow="hidden" border="1px solid" borderColor="gray.200">
        <iframe
          title="map"
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          style={{ border: 0 }}
        />
      </Box>
    </Box>
  );
}
