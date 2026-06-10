import { Box, Divider, HStack, Link, Text, VStack } from '@chakra-ui/react';
import {
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  ShieldIcon,
  VideoIcon,
} from '../../icons';
import { BrandButton } from '../brand';
import type { Business, BusinessWithServices, Service } from '../../../types';
import type { Location } from '../../../types/location';
import type { OpenStatus } from '../utils';
import {
  formatAddressLines,
  formatPhoneTel,
  onlineProviderLabel,
} from '../utils/locationDisplay';
import { NextAvailablePill } from './NextAvailablePill';

interface DesktopBookingCardProps {
  business: BusinessWithServices;
  services: Service[];
  status: OpenStatus;
  onBookNow: () => void;
}

export function DesktopBookingCard({
  business,
  services,
  status,
  onBookNow,
}: DesktopBookingCardProps) {
  const cheapest = findCheapest(services);
  return (
    <Box as="aside" alignSelf="start" position="sticky" top="100px">
      <Box
        bg="surface.card"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="16px"
        p={6}
      >
        {cheapest && (
          <>
            <Text fontSize="sm" color="text.muted" mb={1}>
              Starting from
            </Text>
            <Text fontSize="26px" fontWeight={700} letterSpacing="-0.02em" color="text.heading">
              €{cheapest}
            </Text>
            <Text fontSize="13px" color="text.muted" mt={0.5}>
              {services.length} services available
            </Text>
          </>
        )}

        <Box mt={5}>
          <BrandButton size="lg" w="100%" onClick={onBookNow}>
            Book now
          </BrandButton>
        </Box>

        <Divider my={5} />

        <VStack align="stretch" spacing={3.5} fontSize="sm">
          <HStack flexWrap="wrap">
            {business.showNextAvailable ? (
              <NextAvailablePill business={business} status={status} />
            ) : null}
          </HStack>
          {business.locations.map((loc) => (
            <LocationInfoRow key={loc.id} location={loc} />
          ))}
          {business.website && (
            <InfoRow icon={<GlobeIcon size={16} />} link={business.website}>
              {business.website}
            </InfoRow>
          )}
        </VStack>

        <Divider my={5} />

        <HStack color="text.strong" fontSize="13px" spacing={2.5}>
          <ShieldIcon size={14} />
          <Text as="span">Free cancellation up to 24h before</Text>
        </HStack>
      </Box>
    </Box>
  );
}

function LocationInfoRow({ location }: { location: Location }) {
  if (location.type === 'ADDRESS') {
    const { primary, secondary } = formatAddressLines(location);
    return (
      <InfoRow icon={<MapPinIcon size={16} />} link="Get directions">
        <Text>{primary}</Text>
        {secondary && <Text>{secondary}</Text>}
      </InfoRow>
    );
  }

  if (location.type === 'PHONE') {
    return (
      <InfoRow icon={<PhoneIcon size={16} />}>
        <Link href={`tel:${formatPhoneTel(location.phoneNumber)}`} color="inherit">
          {location.phoneNumber}
        </Link>
      </InfoRow>
    );
  }

  return (
    <InfoRow icon={<VideoIcon size={16} />}>
      {onlineProviderLabel(location)}
    </InfoRow>
  );
}

function InfoRow({
  icon,
  color,
  link,
  children,
}: {
  icon: React.ReactNode;
  color?: string;
  link?: string;
  children: React.ReactNode;
}) {
  return (
    <HStack align="flex-start" spacing={3}>
      <Box color={color ?? 'text.muted'} mt="2px">
        {icon}
      </Box>
      <Box flex="1" color={color ?? 'text.heading'} lineHeight={1.4}>
        <Box>{children}</Box>
        {link && (
          <Link
            mt={0.5}
            display="inline-block"
            color="var(--brand-accent)"
            fontWeight={600}
            fontSize="13px"
          >
            {link}
          </Link>
        )}
      </Box>
    </HStack>
  );
}

function findCheapest(services: Service[]): string | null {
  const priced = services
    .filter((s) => s.priceType === 'FIXED' || s.priceType === 'FROM')
    .map((s) => Number(s.price ?? 0))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!priced.length) return null;
  return String(Math.min(...priced));
}
