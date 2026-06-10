import { AspectRatio, Box, Image } from '@chakra-ui/react';
import type { ResponsiveValue } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface SmartImageProps {
  src?: string | null;
  alt: string;
  /**
   * Aspect ratio of the frame. Pass `'auto'` to render the image at its natural
   * aspect ratio (no fixed frame, no cropping). Default 16/10.
   */
  ratio?: ResponsiveValue<number> | 'auto';
  borderRadius?: ResponsiveValue<string | number>;
  /** How the image fills its frame. Defaults to 'cover' (center-crop). */
  objectFit?: 'cover' | 'contain';
  /** Rendered when src is missing or the image fails to load. */
  fallback?: ReactNode;
  /** Overlay rendered above the image. */
  children?: ReactNode;
  /** Skip lazy-loading for above-the-fold images. */
  eager?: boolean;
}

export function SmartImage({
  src,
  alt,
  ratio = 16 / 10,
  borderRadius = 'xl',
  objectFit = 'cover',
  fallback,
  children,
  eager = false,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = !!src && !failed;
  const isNatural = ratio === 'auto';

  // Natural mode: no AspectRatio wrapper. Image dictates the height.
  if (isNatural) {
    return (
      <Box position="relative" overflow="hidden" borderRadius={borderRadius} w="100%">
        {showImage ? (
          <Image
            src={src!}
            alt={alt}
            display="block"
            w="100%"
            h="auto"
            objectFit={objectFit}
            loading={eager ? 'eager' : 'lazy'}
            onError={() => setFailed(true)}
          />
        ) : (
          fallback && <Box>{fallback}</Box>
        )}
        {children && <Box position="absolute" inset={0}>{children}</Box>}
      </Box>
    );
  }

  return (
    <AspectRatio ratio={ratio as ResponsiveValue<number>}>
      <Box position="relative" overflow="hidden" borderRadius={borderRadius}>
        {showImage ? (
          <Image
            src={src!}
            alt={alt}
            position="absolute"
            inset={0}
            w="100%"
            h="100%"
            objectFit={objectFit}
            objectPosition="center"
            loading={eager ? 'eager' : 'lazy'}
            onError={() => setFailed(true)}
          />
        ) : (
          fallback && (
            <Box position="absolute" inset={0}>
              {fallback}
            </Box>
          )
        )}
        {children && (
          <Box position="absolute" inset={0}>
            {children}
          </Box>
        )}
      </Box>
    </AspectRatio>
  );
}
