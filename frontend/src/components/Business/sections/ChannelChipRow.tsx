import { HStack, Tag } from '@chakra-ui/react';
import { MapPinIcon, PhoneIcon, VideoIcon } from '../../icons';
import type { Location, LocationType } from '../../../types/location';

const CHIP_CONFIG: Record<LocationType, { label: string; Icon: typeof MapPinIcon }> = {
  ADDRESS: { label: 'In person', Icon: MapPinIcon },
  PHONE: { label: 'Phone', Icon: PhoneIcon },
  ONLINE: { label: 'Online', Icon: VideoIcon },
};

const ORDER: LocationType[] = ['ADDRESS', 'PHONE', 'ONLINE'];

export function ChannelChipRow({ locations }: { locations: Location[] }) {
  const present = new Set(locations.map((l) => l.type));
  if (present.size < 2) return null;
  return (
    <HStack spacing={2} flexWrap="wrap" mt={2.5}>
      {ORDER.filter((t) => present.has(t)).map((t) => {
        const { label, Icon } = CHIP_CONFIG[t];
        return (
          <Tag
            key={t}
            size="md"
            borderRadius="full"
            bg="var(--brand-accent-wash)"
            color="var(--brand-accent)"
            fontWeight={500}
          >
            <HStack spacing={1.5}>
              <Icon size={13} />
              <span>{label}</span>
            </HStack>
          </Tag>
        );
      })}
    </HStack>
  );
}
