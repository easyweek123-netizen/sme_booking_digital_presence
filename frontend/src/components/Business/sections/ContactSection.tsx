import { Box, VStack } from '@chakra-ui/react';
import { MapPinIcon, PhoneIcon, VideoIcon } from '../../icons';
import { SectionHeading } from '../SectionHeading';
import { ContactRow } from './contactRows/ContactRow';
import { businessAddressLocation, findBusinessLocation } from '../utils/locationLookup';
import { formatAddressLines, formatPhoneTel, onlineProviderLabel } from '../utils/locationDisplay';
import type { Business } from '../../../types';

interface Props {
  business: Pick<Business, 'locations'>;
}

export function ContactSection({ business }: Props) {
  const address = businessAddressLocation(business);
  const phone = findBusinessLocation(business, 'PHONE');
  const online = findBusinessLocation(business, 'ONLINE');
  if (!address && !phone && !online) return null;

  const mapQuery =
    address && encodeURIComponent([address.line1, address.city].filter(Boolean).join(', '));

  return (
    <Box as="section" pt={8}>
      <SectionHeading id="section-contact">How to reach us</SectionHeading>

      {address && (
        <Box
          mb={3}
          h="360px"
          borderRadius="14px"
          overflow="hidden"
          border="1px solid"
          borderColor="border.subtle"
        >
          <iframe
            title="map"
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            style={{ border: 0 }}
          />
        </Box>
      )}

      <VStack align="stretch" spacing={3}>
        {address && (
          <ContactRow
            icon={<MapPinIcon size={18} />}
            kicker="VISIT US"
            primary={address.line1}
            secondary={formatAddressLines(address).secondary}
            cta={{ label: 'Get directions', href: `https://maps.google.com/?q=${mapQuery}` }}
          />
        )}
        {phone && (
          <ContactRow
            icon={<PhoneIcon size={18} />}
            kicker="CALL US"
            primary={phone.phoneNumber}
            secondary="Tap to dial · we answer in business hours"
            cta={{ label: 'Call now', href: `tel:${formatPhoneTel(phone.phoneNumber)}` }}
          />
        )}
        {online && (
          <ContactRow
            icon={<VideoIcon size={18} />}
            kicker="ONLINE SESSIONS"
            primary={onlineProviderLabel(online)}
            secondary="Sent in confirmation email after booking"
            cta={{ label: 'See online services', href: '#section-services' }}
          />
        )}
      </VStack>
    </Box>
  );
}
