import { Box, Divider, HStack, Link, Text, VStack } from '@chakra-ui/react';
import {
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  ShieldIcon,
} from '../../icons';
import { BrandButton } from '../brand';
import type { Business, Service } from '../../../types';
import type { OpenStatus } from '../utils';
import { businessAddressLocation, businessPhoneNumber } from '../utils/locationLookup';

interface DesktopBookingCardProps {
  business: Business;
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
  const address = businessAddressLocation(business);
  const phone = businessPhoneNumber(business);
  return (
    <Box as="aside" alignSelf="start" position="sticky" top="100px">
      <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="16px" p={6}>
        {cheapest && (
          <>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Starting from
            </Text>
            <Text fontSize="26px" fontWeight={700} letterSpacing="-0.02em">
              €{cheapest}
            </Text>
            <Text fontSize="13px" color="gray.500" mt={0.5}>
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
          <InfoRow
            icon={<ClockIcon size={16} />}
            color={status.open ? 'green.600' : 'orange.500'}
          >
            {status.line}
          </InfoRow>
          {address && (
            <InfoRow icon={<MapPinIcon size={16} />} link="Get directions">
              <Text>{address.line1}</Text>
              <Text>{address.city}</Text>
            </InfoRow>
          )}
          {phone && <InfoRow icon={<PhoneIcon size={16} />}>{phone}</InfoRow>}
          {business.website && (
            <InfoRow icon={<GlobeIcon size={16} />} link={business.website}>
              {business.website}
            </InfoRow>
          )}
        </VStack>

        <Divider my={5} />

        <HStack color="gray.700" fontSize="13px" spacing={2.5}>
          <ShieldIcon size={14} />
          <Text as="span">Free cancellation up to 24h before</Text>
        </HStack>
      </Box>
    </Box>
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
      <Box color={color ?? 'gray.500'} mt="2px">
        {icon}
      </Box>
      <Box flex="1" color={color ?? 'gray.900'} lineHeight={1.4}>
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
