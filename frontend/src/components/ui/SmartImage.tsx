import { AspectRatio, Box, Image } from '@chakra-ui/react';
import type { ResponsiveValue } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface SmartImageProps {
  src?: string | null;
  alt: string;
  /** Aspect ratio of the frame. Default 16/10 (landscape card). */
  ratio?: ResponsiveValue<number>;
  borderRadius?: ResponsiveValue<string | number>;
  /** Rendered when src is missing or the image fails to load. */
  fallback?: ReactNode;
  /** Overlay rendered above the image (gradients, chips, child content). */
  children?: ReactNode;
  /** Skip lazy-loading for above-the-fold images. */
  eager?: boolean;
}

/**
 * Single contract for displaying user-uploaded images.
 * Instagram-style: fixed aspect ratio, object-fit: cover, center crop.
 */
export function SmartImage({
  src,
  alt,
  ratio = 16 / 10,
  borderRadius = 'xl',
  fallback,
  children,
  eager = false,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = !!src && !failed;

  return (
    <AspectRatio ratio={ratio}>
      <Box position="relative" overflow="hidden" borderRadius={borderRadius}>
        {showImage ? (
          <Image
            src={src!}
            alt={alt}
            position="absolute"
            inset={0}
            w="100%"
            h="100%"
            objectFit="cover"
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
