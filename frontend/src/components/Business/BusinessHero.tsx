import { AspectRatio, Box, VStack } from '@chakra-ui/react';
import { CameraPlaceholderIcon } from '../icons';
import { Text } from '@chakra-ui/react';
import { SmartImage } from '../ui/SmartImage';
import { useDeviceMode } from './context/DeviceModeContext';

interface BusinessHeroProps {
  coverImageUrl: string | null;
  enabled: boolean;
  showSetupHints?: boolean;
}

/**
 * Cover image + the "pull next sibling up" overlap. The overlap lives here
 * (not in BusinessHeader) so the header has no idea whether a cover exists —
 * when this component renders nothing, the negative margin disappears with it.
 */
export function BusinessHero({ coverImageUrl, showSetupHints = false }: BusinessHeroProps) {
  const isDesktop = useDeviceMode();
  // if (!enabled) return null;

  if (!coverImageUrl) {
    return (
      <Box borderBottomRadius={isDesktop ? 'lg' : 0} overflow="hidden">
        <AspectRatio ratio={5 / 2} w="full" >
          <VStack
            spacing={2}
            justify="center"
            bg="linear-gradient(135deg, var(--brand-accent-wash) 0%, rgba(255, 255, 255, 0.9) 100%)"
            border="1px dashed"
            borderColor="border.strong"
            color="var(--brand-accent)"
            borderRadius="lg"
          >
            <Box
              w="52px"
              h="52px"
              borderRadius="full"
              bg="rgba(255,255,255,0.85)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="sm"
              _hover={{
                cursor: 'pointer',
                transform: 'translateY(-1px)',
                boxShadow: 'sm',
              }}
              _active={{
                transform: 'translateY(0)',
                boxShadow: 'xs',
              }}
            >
              <CameraPlaceholderIcon />
            </Box>
            <VStack spacing={0.5}>
              <Text fontSize="sm" fontWeight={600} color="text.heading">
                {showSetupHints ? 'Add a cover photo' : 'Cover Image'}
              </Text>
              {showSetupHints && (
                <Text fontSize="xs" color="text.muted">
                  Show your space — a studio shot works great
                </Text>
              )}
            </VStack>
          </VStack>
        </AspectRatio>
      </Box>
    );
  }
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
        borderRadius="lg"
        eager
      />
    </Box>
  );
}
