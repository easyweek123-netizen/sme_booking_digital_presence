import { AspectRatio, Box, Image, IconButton, Text, VStack, type BoxProps } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import { CloseIcon, UploadIcon } from '../../../icons';
import type { ImageField } from './types';

export interface PreviewProps extends Omit<BoxProps, 'onClick'> {
  field: ImageField;
  /** Defaults to 16/9. Pass 1 for a square preview. */
  aspectRatio?: number;
  /** Show the floating X clear button on a filled preview. Defaults true. */
  showOverlayClear?: boolean;
  /** Aria label for the clickable preview button. */
  'aria-label'?: string;
}

export function Preview({
  field,
  aspectRatio = 16 / 9,
  showOverlayClear = true,
  'aria-label': ariaLabel = 'Upload image',
  ...box
}: PreviewProps) {
  const onClear = (e: MouseEvent) => {
    e.stopPropagation();
    field.clear();
  };

  return (
    <Box
      position="relative"
      borderRadius="lg"
      borderWidth={1}
      borderColor={field.hasImage ? 'border.accent' : 'border.subtle'}
      bg="surface.card"
      overflow="hidden"
      cursor="pointer"
      role="button"
      aria-label={ariaLabel}
      onClick={field.openPicker}
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...box}
    >
      {field.hasImage ? (
        <>
          <Image
            src={field.value}
            alt="Preview"
            w="full"
            h="full"
            objectFit="cover"
            onError={field.markLoadError}
            onLoad={field.markLoaded}
          />
          {showOverlayClear && (
            <IconButton
              aria-label="Clear image"
              icon={<CloseIcon size={14} />}
              size="xs"
              position="absolute"
              top={1.5}
              right={1.5}
              borderRadius="full"
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: 'blackAlpha.700' }}
              onClick={onClear}
            />
          )}
        </>
      ) : (
        <AspectRatio ratio={aspectRatio} w="full">
          <VStack spacing={1} color="text.faint" justify="center">
            <UploadIcon size={20} />
            <Text fontSize="xs">{field.loadError ? 'Could not load image' : 'No image'}</Text>
          </VStack>
        </AspectRatio>
      )}
    </Box>
  );
}
