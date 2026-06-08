import {
  AspectRatio,
  Box,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
  type BoxProps,
} from '@chakra-ui/react';
import { useState, type DragEvent, type MouseEvent } from 'react';
import { CloseIcon, UploadIcon } from '../../../icons';
import type { ImageField } from './types';

export interface PreviewProps extends Omit<BoxProps, 'onClick' | 'onDrop' | 'onDragOver' | 'onDragLeave'> {
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
  const [isDragOver, setIsDragOver] = useState(false);
  const filled = field.hasImage;

  const onClear = (e: MouseEvent) => {
    e.stopPropagation();
    field.clear();
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    // Ignore drag-leave events from child elements (relatedTarget is still inside).
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setIsDragOver(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void field.handleFile(file);
  };

  return (
    <Box
      position="relative"
      borderRadius="lg"
      borderWidth={filled ? '1px' : '2px'}
      borderStyle={filled ? 'solid' : 'dashed'}
      borderColor={
        isDragOver ? 'brand.500'
        : filled ? 'border.accent'
        : 'border.strong'
      }
      bg={isDragOver ? 'brand.50' : filled ? 'surface.card' : 'surface.muted'}
      overflow="hidden"
      cursor="pointer"
      role="button"
      aria-label={ariaLabel}
      transition="border-color 0.15s, background-color 0.15s"
      _hover={!filled ? { borderColor: 'brand.500', bg: 'brand.50' } : undefined}
      onClick={field.openPicker}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      {...box}
    >
      <AspectRatio ratio={aspectRatio} w="full">
        {filled ? (
          <Image
            src={field.value}
            alt="Preview"
            objectFit="cover"
            onError={field.markLoadError}
            onLoad={field.markLoaded}
          />
        ) : (
          <VStack spacing={2} color="text.muted" justify="center" px={3}>
            <Icon as={UploadIcon as never} boxSize={5} color="brand.500" />
            <VStack spacing={0.5}>
              <Text fontSize="xs" fontWeight="600" color="text.heading" textAlign="center">
                {field.loadError ? 'Could not load image' : 'Click or drop a file'}
              </Text>
              <Text fontSize="2xs" color="text.muted" textAlign="center">
                PNG, JPG or WEBP
              </Text>
            </VStack>
          </VStack>
        )}
      </AspectRatio>

      {filled && showOverlayClear && (
        <IconButton
          aria-label="Remove image"
          icon={<CloseIcon size={16} />}
          size="sm"
          position="absolute"
          top={2}
          right={2}
          borderRadius="full"
          bg="blackAlpha.700"
          color="white"
          boxShadow="md"
          _hover={{ bg: 'blackAlpha.800' }}
          _active={{ bg: 'blackAlpha.900' }}
          onClick={onClear}
        />
      )}
    </Box>
  );
}
