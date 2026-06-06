import { Box } from '@chakra-ui/react';
import type { Service } from '../../../types';
import { ServiceLocationIcon } from './ServiceLocationIcon';
import { getServiceAccent, type LocationType } from '../helpers';
import { softFromHex } from '../../Business/brand/softFromHex';
import { SmartImage } from '../../ui/SmartImage';

interface Props {
  service: Service;
  locationType: LocationType;
  /** Height in px. Width is derived as size * 1.6 (16:10 landscape). Default 72. */
  size?: number;
}

const TILE_RATIO = 16 / 10;

export function ServiceMediaTile({ service, locationType, size = 72 }: Props) {
  const accent = getServiceAccent(service);
  const soft = service.color ? softFromHex(service.color) : 'brand.50';
  const width = Math.round(size * TILE_RATIO);

  const fallback = (
    <Box
      w="100%"
      h="100%"
      bg={soft}
      display="flex"
      alignItems="center"
      justifyContent="center"
      color={accent}
    >
      <Box transform="scale(2)">
        <ServiceLocationIcon locationType={locationType} size={14} />
      </Box>
    </Box>
  );

  return (
    <Box position="relative" w={`${width}px`} h={`${size}px`} flexShrink={0}>
      <SmartImage
        src={service.photoUrl}
        alt={service.name}
        ratio={TILE_RATIO}
        borderRadius="12px"
        fallback={fallback}
      />
      {service.photoUrl && locationType && (
        <Box
          position="absolute"
          bottom="-6px"
          right="-6px"
          w="26px"
          h="26px"
          borderRadius="full"
          bg="white"
          boxShadow="sm"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={accent}
          zIndex={1}
        >
          <ServiceLocationIcon locationType={locationType} size={14} />
        </Box>
      )}
    </Box>
  );
}
