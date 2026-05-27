import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { CloseIcon } from '../../icons';

export interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder: string;
  helperText?: string;
  previewVariant: 'square' | 'banner';
  clearAriaLabel: string;
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

export function ImageUrlField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  previewVariant,
  clearAriaLabel,
}: ImageUrlFieldProps) {
  const [error, setError] = useState(false);
  const hasImage = !!value && !error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setError(false);
  };

  const handleClear = () => {
    onChange('');
    setError(false);
  };

  return (
    <Box {...dropzoneShellProps}>
      <FormControl>
        <VStack spacing="space.stack.md" align="stretch">
          <FormLabel fontSize="sm" fontWeight="600" color="text.primary" m={0}>
            {label}
          </FormLabel>

          {previewVariant === 'square' ? (
            <Box
              boxSize={32}
              borderRadius="lg"
              borderWidth={1}
              borderColor={hasImage ? 'border.accent' : 'border.subtle'}
              bg="surface.card"
              overflow="hidden"
              alignSelf="center"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {hasImage ? (
                <Image
                  src={value}
                  alt={`${label} preview`}
                  boxSize="full"
                  objectFit="cover"
                  onError={() => setError(true)}
                  onLoad={() => setError(false)}
                />
              ) : (
                <Text fontSize="lg" color="text.faint">
                  {error ? '⚠' : '🖼'}
                </Text>
              )}
            </Box>
          ) : (
            <Box
              position="relative"
              h={40}
              w="full"
              borderRadius="lg"
              borderWidth={1}
              borderColor={hasImage ? 'border.accent' : 'border.subtle'}
              bg="surface.page"
              overflow="hidden"
            >
              {hasImage ? (
                <Image
                  src={value}
                  alt={`${label} preview`}
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  w="full"
                  h="full"
                  objectFit="cover"
                  onError={() => setError(true)}
                  onLoad={() => setError(false)}
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
                    {error ? 'Could not load image' : 'Preview'}
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {error && previewVariant === 'square' && (
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
                    placeholder={placeholder}
                    value={value ?? ''}
                    onChange={handleChange}
                    pr={value ? 10 : 4}
                  />
                  {value && (
                    <InputRightElement h="full">
                      <IconButton
                        aria-label={clearAriaLabel}
                        icon={<CloseIcon />}
                        size="sm"
                        variant="ghost"
                        color="text.faint"
                        _hover={{ color: 'text.secondary' }}
                        onClick={handleClear}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {helperText && (
            <FormHelperText {...helperTextProps}>{helperText}</FormHelperText>
          )}
        </VStack>
      </FormControl>
    </Box>
  );
}
