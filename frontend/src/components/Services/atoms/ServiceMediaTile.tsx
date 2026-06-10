import { Box } from '@chakra-ui/react';
import type { BoxProps, ResponsiveValue } from '@chakra-ui/react';
import type { Service } from '../../../types';
import { ServiceLocationIcon } from './ServiceLocationIcon';
import { getServiceAccent, type LocationType } from '../helpers';
import { softFromHex } from '../../Business/brand/softFromHex';
import { SmartImage } from '../../ui/SmartImage';

interface Props {
  service: Service;
  locationType: LocationType;
  /**
   * Tile height as a Chakra dimension value (CSS string or theme token).
   * Accepts responsive values so callers can shrink the tile on narrow
   * containers, e.g. `h={{ base: '56px', md: '84px' }}`. Default '72px'.
   */
  h?: BoxProps['h'];
  /**
   * Aspect ratio (width / height). Default 16:10 (landscape).
   * Pass `1` for a square tile if that suits the surface better.
   */
  ratio?: ResponsiveValue<number>;
}

export function ServiceMediaTile({
  service,
  locationType,
  h = '72px',
  ratio = 16 / 10,
}: Props) {
  const accent = getServiceAccent(service);
  const soft = service.color ? softFromHex(service.color) : 'brand.50';

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
    <Box
      position="relative"
      h={h}
      sx={{ aspectRatio: ratio as number }}
      flexShrink={0}
    >
      <SmartImage
        src={service.photoUrl}
        alt={service.name}
        ratio={ratio}
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
          bg="surface.card"
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
