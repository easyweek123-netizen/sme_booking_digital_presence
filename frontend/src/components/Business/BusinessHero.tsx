import { Box } from '@chakra-ui/react';
import { SmartImage } from '../ui/SmartImage';
import { useDeviceMode } from './context/DeviceModeContext';

interface BusinessHeroProps {
  coverImageUrl: string | null;
  enabled: boolean;
}

/**
 * Cover image + the "pull next sibling up" overlap. The overlap lives here
 * (not in BusinessHeader) so the header has no idea whether a cover exists —
 * when this component renders nothing, the negative margin disappears with it.
 */
export function BusinessHero({ coverImageUrl, enabled }: BusinessHeroProps) {
  const isDesktop = useDeviceMode();
  if (!enabled || !coverImageUrl) return null;

  return (
    <Box
      borderBottomRadius={isDesktop ? 'lg' : 0}
      overflow="hidden"
    >
      <SmartImage
        src={coverImageUrl}
        alt=""
        objectFit="contain"
        ratio={5 / 2}
        borderRadius={0}
        eager
      />
    </Box>
  );
}
