import { Box, Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { ResponsiveValue } from '@chakra-ui/react';
import type { Service } from '../../../types';
import { ServiceLocationIcon } from './ServiceLocationIcon';
import { darken, getServiceAccent, type LocationType } from '../helpers';
import { SmartImage } from '../../ui/SmartImage';

interface Props {
  service: Service;
  locationType: LocationType;
  children: ReactNode;
  /** Aspect ratio of the cover. Default 16/10. */
  ratio?: ResponsiveValue<number>;
  borderRadius?: string | number;
}

export function ServiceCoverImage({
  service,
  locationType,
  children,
  ratio = 16 / 10,
  borderRadius = 'xl',
}: Props) {
  const accent = getServiceAccent(service);
  const wash = `linear-gradient(135deg, ${accent} 0%, ${darken(accent, 0.25)} 100%)`;

  const fallback = (
    <Box position="absolute" inset={0} bg={wash}>
      {locationType && (
        <Box
          position="absolute"
          right={-4}
          top="50%"
          transform="translateY(-55%)"
          opacity={0.13}
          color="white"
          pointerEvents="none"
        >
          <ServiceLocationIcon locationType={locationType} size={160} />
        </Box>
      )}
    </Box>
  );

  return (
    <SmartImage
      src={service.photoUrl}
      alt={service.name}
      ratio={ratio}
      borderRadius={borderRadius}
      fallback={fallback}
    >
      <Flex direction="column" justify="space-between" h="100%">
        {children}
      </Flex>
    </SmartImage>
  );
}
