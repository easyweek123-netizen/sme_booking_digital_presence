import {
  AspectRatio,
  Box,
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRef, useState, type MouseEvent } from 'react';
import { CloseIcon, LinkIcon, UploadIcon } from '../../icons';
import { IMAGE_ACCEPT, useImageUpload } from '../../../lib/useImageUpload';

export interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Storage subfolder, e.g. 'services' or 'business'. */
  folder: string;
  previewVariant: 'square' | 'banner' | 'cover';
  clearAriaLabel: string;
  placeholder?: string;
  helperText?: string;
}
export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  previewVariant,
  clearAriaLabel,
  placeholder = 'https://example.com/image.jpg',
  helperText,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadError, setLoadError] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const { upload, uploading, progress, error, reset } = useImageUpload({ folder });

  const hasImage = !!value && !loadError;

  const openPicker = () => inputRef.current?.click();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const url = await upload(file);
    if (url) {
      setLoadError(false);
      setUrlMode(false);
      onChange(url);
    }
  };

  const handleClear = (e?: MouseEvent) => {
    e?.stopPropagation();
    onChange('');
    setLoadError(false);
    reset();
  };

  return (
    <Box>
      <FormControl>
        <VStack spacing="space.stack.md" align="stretch">
          <FormLabel fontSize="sm" fontWeight="600" color="text.primary" m={0}>
            {label}
          </FormLabel>

          <Grid
            templateColumns="2fr 1fr"
            gap={4}
            alignItems="flex-start"
            w="full"
          >
            <ImagePreviewBox
              label={label}
              value={value}
              hasImage={hasImage}
              loadError={loadError}
              previewVariant={previewVariant}
              clearAriaLabel={clearAriaLabel}
              onOpenPicker={openPicker}
              onClear={handleClear}
              onLoadError={() => setLoadError(true)}
              onLoadSuccess={() => setLoadError(false)}
            />
            <ImageUploadActions
              uploading={uploading}
              urlMode={urlMode}
              onOpenPicker={openPicker}
              onToggleUrlMode={() => setUrlMode((m) => !m)}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              setLoadError={setLoadError}
              handleClear={handleClear}
              clearAriaLabel='Clear image'
            />
          </Grid>

          {uploading && (
            <Progress
              value={progress}
              size="xs"
              borderRadius="full"
              colorScheme="brand"
              hasStripe
              isAnimated
            />
          )}

          {error && (
            <Text fontSize="xs" color="orange.500">
              {error}
            </Text>
          )}

          <Input
            ref={inputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            display="none"
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />

          {helperText && (
            <FormHelperText fontSize="xs" color="text.muted">
              {helperText}
            </FormHelperText>
          )}
        </VStack>
      </FormControl>
    </Box>
  );
}

interface ImagePreviewBoxProps {
  label: string;
  value: string;
  hasImage: boolean;
  loadError: boolean;
  previewVariant: 'square' | 'banner' | 'cover';
  clearAriaLabel: string;
  onOpenPicker: () => void;
  onClear: (e?: MouseEvent) => void;
  onLoadError: () => void;
  onLoadSuccess: () => void;
}

function ImagePreviewBox({
  label,
  value,
  hasImage,
  loadError,
  previewVariant,
  clearAriaLabel,
  onOpenPicker,
  onClear,
  onLoadError,
  onLoadSuccess,
}: ImagePreviewBoxProps) {
  const sizeProps =
    previewVariant === 'square'
      ? { boxSize: 32, flexShrink: 0 }
      : previewVariant === 'banner'
        ? { flex: 1, minW: 0, h: 32 }
        : { flex: 1, minW: 0 }; // 'cover' — height comes from AspectRatio

  return (
    <Box
      {...sizeProps}
      position="relative"
      borderRadius="lg"
      borderWidth={1}
      borderColor={hasImage ? 'border.accent' : 'border.subtle'}
      bg="surface.card"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      role="button"
      aria-label={`Upload ${label}`}
      onClick={onOpenPicker}
    >
      {hasImage ? (
        <>
          <Image
            src={value}
            alt={`${label} preview`}
            w="full"
            h="full"
            objectFit="contain"
            onError={onLoadError}
            onLoad={onLoadSuccess}
          />
          <IconButton
            aria-label={clearAriaLabel}
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
        </>
      ) : (
        <AspectRatio ratio={16 / 10} w="100%">
          <VStack spacing={1} color="text.faint" justify="center">
            <UploadIcon size={20} />
            <Text fontSize="xs">
              {loadError ? 'Could not load image' : 'No image'}
            </Text>
          </VStack>
        </AspectRatio>
      )}
    </Box>
  );
}

interface ImageUploadActionsProps {
  uploading: boolean;
  urlMode: boolean;
  onOpenPicker: () => void;
  onToggleUrlMode: () => void;
  placeholder: string,
  value: string,
  onChange: (url: string) => void,
  setLoadError: (error: boolean) => void,
  handleClear: () => void,
  clearAriaLabel: string,
}

function ImageUploadActions({
  uploading,
  urlMode,
  onOpenPicker,
  onToggleUrlMode,
  placeholder,
  value,
  onChange,
  setLoadError,
  handleClear,
  clearAriaLabel
}: ImageUploadActionsProps) {
  return (
    <VStack align="flex-start" spacing={2} justify="center" flexShrink={0} pt={1}>
      <Button
        leftIcon={<UploadIcon size={16} />}
        size="sm"
        variant="ghost"
        onClick={onOpenPicker}
        isLoading={uploading}
        loadingText="Uploading"
      >
        Upload image
      </Button>
      <Button
        leftIcon={<LinkIcon size={16} />}
        size="sm"
        variant="ghost"
        color={urlMode ? 'brand.500' : 'text.secondary'}
        onClick={onToggleUrlMode}
      >
        Paste URL
      </Button>
      <Collapse in={urlMode} animateOpacity>
        <InputGroup size="sm">
          <Input
            placeholder={placeholder}
            value={value ?? ''}
            onChange={(e) => {
              onChange(e.target.value);
              setLoadError(false);
            }}
            pr={value ? 10 : 4}
            autoFocus
          />
          {value && (
            <InputRightElement h="full">
              <IconButton
                aria-label={clearAriaLabel}
                icon={<CloseIcon size={14} />}
                size="xs"
                variant="ghost"
                color="text.faint"
                _hover={{ color: 'text.secondary' }}
                onClick={() => handleClear()}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </Collapse>
    </VStack>
  );
}
