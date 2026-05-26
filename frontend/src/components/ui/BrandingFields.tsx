import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CloseIcon } from '../icons';
import { ColorField } from './form/ColorField';
import { BRAND_COLOR_PRESETS } from '../../constants';
import type { WebsiteFormValues } from '../../pages/dashboard/websiteForm.types';

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

export function BrandingFields() {
  const { control, watch, setValue } = useFormContext<WebsiteFormValues>();
  const logoUrl = watch('branding.logoUrl');
  const coverImageUrl = watch('branding.coverImageUrl');
  const onCoverImageUrlChange = (url: string) =>
    setValue('branding.coverImageUrl', url, { shouldDirty: true });

  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const presetHexes = useToken('colors', [...BRAND_COLOR_PRESETS]);

  const handleLogoFile = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setValue('branding.logoUrl', dataUrl, { shouldDirty: true });
    setLogoError(false);
  };

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('branding.logoUrl', e.target.value, { shouldDirty: true });
    setLogoError(false);
  };

  const handleCoverUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCoverImageUrlChange?.(e.target.value);
    setCoverError(false);
  };

  const handleClearLogo = () => {
    setValue('branding.logoUrl', '', { shouldDirty: true });
    setLogoError(false);
  };

  const handleClearCover = () => {
    onCoverImageUrlChange?.('');
    setCoverError(false);
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
            <Button variant="outline" size="sm" onClick={() => logoFileRef.current?.click()}>
              {logoUrl ? 'Replace logo' : 'Upload logo'}
            </Button>
            <input
              ref={logoFileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleLogoFile(file);
                e.target.value = '';
              }}
            />
            <Text {...helperTextProps}>
              PNG or JPG, up to 2MB. Square images look best.
            </Text>
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
      </SimpleGrid>

      <Controller
        control={control}
        name="branding.brandColor"
        render={({ field }) => (
          <ColorField
            label="Brand color"
            value={field.value || presetHexes[0]}
            onChange={(c) => field.onChange(c)}
            presets={presetHexes}
            allowCustom
            showCheckmark={false}
          />
        )}
      />
    </VStack>
  );
}
