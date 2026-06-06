import { Box, FormControl, FormLabel, HStack, Input, Text } from '@chakra-ui/react';
import { CheckIcon, PlusIcon } from '../../icons';

export interface ColorFieldProps {
  value: string | null | undefined;
  onChange: (next: string) => void;
  presets: readonly string[];
  label?: string;
  caption?: string;
  allowCustom?: boolean;
  showCheckmark?: boolean;
}

export function ColorField({
  value,
  onChange,
  presets,
  label,
  caption,
  allowCustom = false,
  showCheckmark = false,
}: ColorFieldProps) {
  const current = value ?? presets[0];
  const isHexPreset = (c: string) => c.startsWith('#');
  const isPreset = presets.some(
    (c) => c.toLowerCase() === (current ?? '').toLowerCase(),
  );
  const customIsActive = allowCustom && !isPreset && !!current;

  return (
    <FormControl>
      {label && (
        <FormLabel fontSize="sm" fontWeight="500" color="text.strong">
          {label}
          {caption && (
            <>
              {' · '}
              <Text as="span" fontWeight="normal" color="text.muted">
                {caption}
              </Text>
            </>
          )}
        </FormLabel>
      )}
      <HStack spacing={2}>
        {presets.map((c) => {
          const isActive =
            current?.toLowerCase?.() === c.toLowerCase?.() || current === c;
          return (
            <Box
              key={c}
              as="button"
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => onChange(c)}
              w={9}
              h={9}
              borderRadius="full"
              bg={c}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderWidth={isActive ? 2 : 1}
              borderColor={isActive ? (isHexPreset(c) ? c : 'border.strong') : 'border.subtle'}
              transition="all 0.15s"
              _hover={{ transform: 'scale(1.05)' }}
              cursor="pointer"
              color="white"
            >
              {showCheckmark && isActive && <CheckIcon size={14} />}
            </Box>
          );
        })}
        {allowCustom && (
          <Box
            position="relative"
            w={9}
            h={9}
            borderRadius="full"
            overflow="hidden"
            borderWidth={customIsActive ? 2 : 1}
            borderColor={customIsActive ? (current as string) : 'border.subtle'}
            bg={customIsActive ? (current as string) : 'transparent'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            flexShrink={0}
          >
            {showCheckmark && customIsActive ? (
              <CheckIcon size={14} />
            ) : (
              <PlusIcon size={14} aria-hidden />
            )}
            <Input
              type="color"
              value={isHexPreset(current ?? '') ? (current ?? '#000000') : '#000000'}
              onChange={(e) => onChange(e.target.value)}
              position="absolute"
              inset={0}
              w="100%"
              h="100%"
              p={0}
              border="none"
              opacity={0}
              cursor="pointer"
              aria-label="Pick a custom color"
            />
          </Box>
        )}
      </HStack>
    </FormControl>
  );
}
