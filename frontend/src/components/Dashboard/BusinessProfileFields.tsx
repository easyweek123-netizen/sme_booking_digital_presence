import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
  Heading,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { PhoneIcon } from '../icons';
import type { WebsiteFormValues } from '../../pages/dashboard/websiteForm.types';

const sectionHeadingProps = {
  size: 'xs' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: 'wider' as const,
  color: 'text.strong',
  mb: 3,
};

const helperTextProps = {
  fontSize: 'xs',
  color: 'text.muted',
};

export function BusinessProfileFields() {
  const { register } = useFormContext<WebsiteFormValues>();

  return (
    <VStack spacing="space.stack.lg" align="stretch">
      <Box>
        <Heading {...sectionHeadingProps}>Identity</Heading>
        <VStack spacing="space.stack.md" align="stretch">
          <FormControl>
            <FormLabel>Business name</FormLabel>
            <Input
              {...register('profile.name')}
              placeholder="Your business name"
              size="md"
              autoComplete="organization"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...register('profile.description')}
              placeholder="A short tagline customers see on your booking page"
              rows={3}
              size="md"
            />
            <FormHelperText {...helperTextProps}>
              Plain text is best here; use the About section for longer formatted content.
            </FormHelperText>
          </FormControl>
        </VStack>
      </Box>

      <Box>
        <Heading {...sectionHeadingProps}>Contact</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="space.stack.md">
          <FormControl>
            <FormLabel>Phone</FormLabel>
            <InputGroup size="md">
              <InputLeftAddon bg="surface.alt" borderColor="border.subtle" px={3}>
                <PhoneIcon size={18} />
              </InputLeftAddon>
              <Input
                {...register('profile.phone')}
                type="tel"
                placeholder="+1 555 123 4567"
                borderLeftRadius={0}
                size="md"
                autoComplete="tel"
              />
            </InputGroup>
            <FormHelperText {...helperTextProps}>
              Shown on your booking page. Include country code.
            </FormHelperText>
          </FormControl>

          <VStack spacing="space.stack.md" align="stretch">
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                {...register('profile.address')}
                placeholder="Street and number"
                size="md"
                autoComplete="street-address"
              />
            </FormControl>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                {...register('profile.city')}
                placeholder="City"
                size="md"
                autoComplete="address-level2"
              />
            </FormControl>
          </VStack>
        </SimpleGrid>
      </Box>

      <Box>
        <Heading {...sectionHeadingProps}>Online presence</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="space.stack.md">
          <FormControl>
            <FormLabel>Website</FormLabel>
            <Input
              {...register('profile.website')}
              type="url"
              placeholder="https://example.com"
              size="md"
              autoComplete="url"
            />
            <FormHelperText {...helperTextProps}>
              Your existing website, if you have one.
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Instagram</FormLabel>
            <Input
              {...register('profile.instagram')}
              placeholder="@yourbusiness or full profile URL"
              size="md"
              autoComplete="off"
            />
            <FormHelperText {...helperTextProps}>@handle or full URL.</FormHelperText>
          </FormControl>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
