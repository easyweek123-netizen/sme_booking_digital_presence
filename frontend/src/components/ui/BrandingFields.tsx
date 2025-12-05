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
} from '@chakra-ui/react';
import { useState } from 'react';
import { CloseIcon } from '../icons';
import { DEFAULT_BRAND_COLOR } from '../../utils/brandColor';

interface BrandingFieldsProps {
  logoUrl: string;
  brandColor: string;
  onLogoUrlChange: (url: string) => void;
  onBrandColorChange: (color: string) => void;
}

export function BrandingFields({
  logoUrl,
  brandColor,
  onLogoUrlChange,
  onBrandColorChange,
}: BrandingFieldsProps) {
  const [logoError, setLogoError] = useState(false);

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLogoUrlChange(e.target.value);
    setLogoError(false);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBrandColorChange(e.target.value);
  };

  const handleClearLogo = () => {
    onLogoUrlChange('');
    setLogoError(false);
  };

  const handleClearColor = () => {
    onBrandColorChange('');
  };

  const displayColor = brandColor || DEFAULT_BRAND_COLOR;

  return (
    <VStack spacing={4} align="stretch">
      {/* Logo URL - Full Row */}
      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
          Logo URL
          <Text as="span" color="gray.400" fontWeight="400" ml={1}>
            (optional)
          </Text>
        </FormLabel>
        <HStack spacing={3}>
          <InputGroup size="lg" flex={1}>
            <Input
              placeholder="https://example.com/your-logo.png"
              value={logoUrl}
              onChange={handleLogoUrlChange}
              borderRadius="lg"
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
              }}
              pr={logoUrl ? '40px' : '16px'}
            />
            {logoUrl && (
              <InputRightElement h="full">
                <IconButton
                  aria-label="Clear logo"
                  icon={<CloseIcon />}
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: 'gray.600' }}
                  onClick={handleClearLogo}
                />
              </InputRightElement>
            )}
          </InputGroup>
          
          {/* Logo Preview */}
          <Box
            w="48px"
            h="48px"
            borderRadius="xl"
            border="2px"
            borderColor={logoUrl && !logoError ? 'brand.200' : 'gray.200'}
            bg={logoUrl && !logoError ? 'white' : 'gray.50'}
            overflow="hidden"
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.2s"
          >
            {logoUrl && !logoError ? (
              <Image
                src={logoUrl}
                alt="Logo preview"
                w="full"
                h="full"
                objectFit="cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Text fontSize="lg" color="gray.300">
                {logoError ? '⚠' : '🖼'}
              </Text>
            )}
          </Box>
        </HStack>
        {logoError && (
          <Text fontSize="xs" color="orange.500" mt={1}>
            Could not load image from URL
          </Text>
        )}
      </FormControl>

      {/* Brand Color - Full Row */}
      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
          Brand Color
          <Text as="span" color="gray.400" fontWeight="400" ml={1}>
            (optional)
          </Text>
        </FormLabel>
        <HStack spacing={3}>
          {/* Color Picker Button */}
          <Box
            as="label"
            w="48px"
            h="48px"
            borderRadius="xl"
            bg={displayColor}
            cursor="pointer"
            border="2px"
            borderColor={brandColor ? 'gray.300' : 'gray.200'}
            _hover={{ transform: 'scale(1.03)', borderColor: 'gray.400' }}
            transition="all 0.15s"
            position="relative"
            overflow="hidden"
            flexShrink={0}
            boxShadow={brandColor ? 'sm' : 'none'}
          >
            <Input
              type="color"
              value={displayColor}
              onChange={handleColorChange}
              position="absolute"
              top={0}
              left={0}
              w="200%"
              h="200%"
              opacity={0}
              cursor="pointer"
            />
          </Box>
          
          {/* Color Value Display */}
          <InputGroup size="lg" flex={1}>
            <Input
              value={brandColor ? brandColor.toUpperCase() : ''}
              placeholder="Click color box or enter hex (e.g. #FF5733)"
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                  onBrandColorChange(val.startsWith('#') ? val : `#${val}`);
                }
              }}
              borderRadius="lg"
              fontFamily="mono"
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
              }}
              pr={brandColor ? '40px' : '16px'}
            />
            {brandColor && (
              <InputRightElement h="full">
                <IconButton
                  aria-label="Reset to default"
                  icon={<CloseIcon />}
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: 'gray.600' }}
                  onClick={handleClearColor}
                />
              </InputRightElement>
            )}
          </InputGroup>
        </HStack>
      </FormControl>
    </VStack>
  );
}
