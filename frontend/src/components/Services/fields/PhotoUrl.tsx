import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface PhotoUrlProps {
  name?: string;
  label?: string;
}

const STRIPE_BG =
  'repeating-linear-gradient(45deg, #E8E1D0 0 12px, #DCD2BB 12px 24px)';

export function PhotoUrl({
  name = 'photoUrl',
  label = 'Photo',
}: PhotoUrlProps) {
  const { control } = useFormContext();
  const [editing, setEditing] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = (field.value as string | null) ?? '';
        return (
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" color="text.strong">
              {label}{' '}
              <Text as="span" fontSize="sm" color="text.muted" fontWeight="400">
                Optional
              </Text>
            </FormLabel>
            <HStack spacing={4} align="flex-start">
              <Box
                w="96px"
                h="96px"
                borderRadius="md"
                overflow="hidden"
                borderWidth={1}
                borderColor="border.subtle"
                background={value ? undefined : STRIPE_BG}
                position="relative"
              >
                {value ? (
                  <Image
                    src={value}
                    alt="Service photo"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                ) : (
                  <Box
                    position="absolute"
                    inset={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="text.muted"
                      letterSpacing="wider"
                    >
                      COVER
                    </Text>
                  </Box>
                )}
              </Box>

              <VStack align="flex-start" spacing={2} flex={1}>
                {editing ? (
                  <Input
                    autoFocus
                    placeholder="https://example.com/photo.jpg"
                    value={value}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    onBlur={() => {
                      field.onBlur();
                      setEditing(false);
                    }}
                    size="sm"
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    Replace
                  </Button>
                )}
                <Text fontSize="xs" color="text.muted">
                  PNG · JPG · ≤ 4MB
                </Text>
              </VStack>
            </HStack>
          </FormControl>
        );
      }}
    />
  );
}
