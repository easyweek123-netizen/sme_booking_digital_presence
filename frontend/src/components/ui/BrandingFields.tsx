import {
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Image,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  FormHelperText,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToken,
} from '@chakra-ui/react';
import { useState } from 'react';
import { CloseIcon } from '../icons';
import { DEFAULT_BRAND_COLOR } from '../../utils/brandColor';

const PRESET_COLOR_KEYS = [
  'brand.500',
  'coral.400',
  'sage.500',
  'amber.500',
  'gray.800',
  'gray.500',
] as const;

interface BrandingFieldsProps {
  logoUrl: string;
  brandColor: string;
  onLogoUrlChange: (url: string) => void;
  onBrandColorChange: (color: string) => void;
  coverImageUrl?: string;
  onCoverImageUrlChange?: (url: string) => void;
}

const dropzoneShellProps = {
  borderWidth: 1,
  borderStyle: 'dashed',
  borderColor: 'border.subtle',
  borderRadius: 'xl',
  bg: 'surface.alt',
  p: 'space.card.padding',
} as const;

const helperTextProps = {
  fontSize: 'xs',
  color: 'text.muted',
};

export function BrandingFields({
  logoUrl,
  brandColor,
  onLogoUrlChange,
  onBrandColorChange,
  coverImageUrl,
  onCoverImageUrlChange,
}: BrandingFieldsProps) {
  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const presetHexes = useToken('colors', [...PRESET_COLOR_KEYS]);

  const [localColor, setLocalColor] = useState(brandColor || DEFAULT_BRAND_COLOR);
  const [prevBrandColor, setPrevBrandColor] = useState(brandColor);
  if (brandColor !== prevBrandColor) {
    setPrevBrandColor(brandColor);
    setLocalColor(brandColor || DEFAULT_BRAND_COLOR);
  }

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLogoUrlChange(e.target.value);
    setLogoError(false);
  };

  const handleCoverUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCoverImageUrlChange?.(e.target.value);
    setCoverError(false);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalColor(e.target.value);
  };

  const handleColorBlur = () => {
    if (localColor !== (brandColor || DEFAULT_BRAND_COLOR)) {
      onBrandColorChange(localColor === DEFAULT_BRAND_COLOR ? '' : localColor);
    }
  };

  const handleClearLogo = () => {
    onLogoUrlChange('');
    setLogoError(false);
  };

  const handleClearColor = () => {
    setLocalColor(DEFAULT_BRAND_COLOR);
    onBrandColorChange('');
  };

  const handleClearCover = () => {
    onCoverImageUrlChange?.('');
    setCoverError(false);
  };

  const applyPreset = (hex: string) => {
    if (!hex) return;
    onBrandColorChange(hex);
    setLocalColor(hex);
  };

  return (
    <VStack spacing="space.stack.lg" align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="space.stack.md">
        <Box {...dropzoneShellProps}>
          <VStack spacing="space.stack.md" align="stretch">
            <Text fontSize="sm" fontWeight="600" color="text.primary">
              Logo
            </Text>
            <Box
              boxSize={32}
              borderRadius="lg"
              borderWidth={1}
              borderColor={logoUrl && !logoError ? 'border.accent' : 'border.subtle'}
              bg="surface.card"
              overflow="hidden"
              alignSelf="center"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {logoUrl && !logoError ? (
                <Image
                  src={logoUrl}
                  alt="Logo preview"
                  boxSize="full"
                  objectFit="cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Text fontSize="lg" color="text.faint">
                  {logoError ? '⚠' : '🖼'}
                </Text>
              )}
            </Box>
            {logoError && (
              <Text fontSize="xs" color="orange.500">
                Could not load image from URL
              </Text>
            )}
            <Accordion allowToggle>
              <AccordionItem border="none">
                <AccordionButton
                  px={0}
                  py={2}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight="600"
                  color="text.secondary"
                  _hover={{ bg: 'transparent', color: 'accent.hover' }}
                >
                  <Box as="span" flex="1" textAlign="left">
                    Paste URL
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel px={0} pb={0}>
                  <InputGroup size="md">
                    <Input
                      placeholder="https://example.com/your-logo.png"
                      value={logoUrl}
                      onChange={handleLogoUrlChange}
                      pr={logoUrl ? 10 : 4}
                    />
                    {logoUrl && (
                      <InputRightElement h="full">
                        <IconButton
                          aria-label="Clear logo"
                          icon={<CloseIcon />}
                          size="sm"
                          variant="ghost"
                          color="text.faint"
                          _hover={{ color: 'text.secondary' }}
                          onClick={handleClearLogo}
                        />
                      </InputRightElement>
                    )}
                  </InputGroup>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        </Box>

        {onCoverImageUrlChange && (
          <Box {...dropzoneShellProps}>
            <FormControl>
              <VStack spacing="space.stack.md" align="stretch">
                <FormLabel fontSize="sm" fontWeight="600" color="text.primary" m={0}>
                  Cover image
                </FormLabel>
                <Box
                  position="relative"
                  h={40}
                  w="full"
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor={
                    coverImageUrl && !coverError ? 'border.accent' : 'border.subtle'
                  }
                  bg="surface.page"
                  overflow="hidden"
                >
                  {coverImageUrl && !coverError ? (
                    <Image
                      src={coverImageUrl}
                      alt=""
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      w="full"
                      h="full"
                      objectFit="cover"
                      onError={() => setCoverError(true)}
                      onLoad={() => setCoverError(false)}
                    />
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      h="full"
                      w="full"
                    >
                      <Text fontSize="sm" color="text.faint">
                        {coverError ? 'Could not load cover' : 'Preview'}
                      </Text>
                    </Box>
                  )}
                </Box>
                <Accordion allowToggle>
                  <AccordionItem border="none">
                    <AccordionButton
                      px={0}
                      py={2}
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="600"
                      color="text.secondary"
                      _hover={{ bg: 'transparent', color: 'accent.hover' }}
                    >
                      <Box as="span" flex="1" textAlign="left">
                        Paste URL
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0} pb={0}>
                      <InputGroup size="md">
                        <Input
                          placeholder="https://example.com/cover-image.jpg"
                          value={coverImageUrl ?? ''}
                          onChange={handleCoverUrlChange}
                          pr={coverImageUrl ? 10 : 4}
                        />
                        {coverImageUrl && (
                          <InputRightElement h="full">
                            <IconButton
                              aria-label="Clear cover image"
                              icon={<CloseIcon />}
                              size="sm"
                              variant="ghost"
                              color="text.faint"
                              _hover={{ color: 'text.secondary' }}
                              onClick={handleClearCover}
                            />
                          </InputRightElement>
                        )}
                      </InputGroup>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                <FormHelperText {...helperTextProps}>
                  Add a cover image for your booking page header. Leave empty to use a gradient based
                  on your brand color.
                </FormHelperText>
              </VStack>
            </FormControl>
          </Box>
        )}
      </SimpleGrid>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500" color="text.strong">
          Brand color
        </FormLabel>
        <HStack spacing="space.stack.md" align="flex-start">
          <Box
            as="label"
            boxSize={12}
            borderRadius="xl"
            bg={localColor}
            cursor="pointer"
            borderWidth={1}
            borderColor="border.subtle"
            _hover={{ transform: 'scale(1.03)', borderColor: 'border.strong' }}
            transition="all 0.15s"
            position="relative"
            overflow="hidden"
            flexShrink={0}
            boxShadow={brandColor ? 'sm' : 'none'}
          >
            <Input
              type="color"
              value={localColor}
              onChange={handleColorChange}
              onBlur={handleColorBlur}
              position="absolute"
              top={0}
              left={0}
              w="200%"
              h="200%"
              opacity={0}
              cursor="pointer"
            />
          </Box>

          <InputGroup size="md" flex={1}>
            <Input
              value={brandColor ? brandColor.toUpperCase() : ''}
              placeholder="Click swatch or enter hex (e.g. #FF5733)"
              size="md"
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                  onBrandColorChange(val.startsWith('#') ? val : `#${val}`);
                }
              }}
              fontFamily="mono"
              pr={brandColor ? 10 : 4}
            />
            {brandColor && (
              <InputRightElement h="full">
                <IconButton
                  aria-label="Reset to default"
                  icon={<CloseIcon />}
                  size="sm"
                  variant="ghost"
                  color="text.faint"
                  _hover={{ color: 'text.secondary' }}
                  onClick={handleClearColor}
                />
              </InputRightElement>
            )}
          </InputGroup>
        </HStack>

        <HStack spacing="space.stack.sm" flexWrap="wrap" mt="space.stack.md">
          {PRESET_COLOR_KEYS.map((key, i) => (
            <Box
              key={key}
              as="button"
              type="button"
              boxSize={8}
              borderRadius="full"
              bg={key}
              borderWidth={1}
              borderColor="border.subtle"
              cursor="pointer"
              flexShrink={0}
              aria-label={`Use ${key} preset`}
              onClick={() => applyPreset(presetHexes[i] ?? '')}
              _hover={{ boxShadow: 'md', borderColor: 'border.strong' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'brand.500',
                outlineOffset: 2,
              }}
            />
          ))}
        </HStack>

        <FormHelperText {...helperTextProps} mt="space.stack.sm">
          Used for accents on your booking page. Pick a swatch or enter a hex value.
        </FormHelperText>
      </FormControl>
    </VStack>
  );
}
