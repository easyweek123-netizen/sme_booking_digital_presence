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
import { PhoneIcon } from '../icons';

export interface BusinessProfileValues {
  name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  website: string;
  instagram: string;
}

interface BusinessProfileFieldsProps {
  values: BusinessProfileValues;
  onChange: (name: string, value: string) => void;
}

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

export function BusinessProfileFields({
  values,
  onChange,
}: BusinessProfileFieldsProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <VStack spacing="space.stack.lg" align="stretch">
      <Box>
        <Heading {...sectionHeadingProps}>Identity</Heading>
        <VStack spacing="space.stack.md" align="stretch">
          <FormControl>
            <FormLabel>Business name</FormLabel>
            <Input
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Your business name"
              size="md"
              autoComplete="organization"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={values.description}
              onChange={handleChange}
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
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
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
                name="address"
                value={values.address}
                onChange={handleChange}
                placeholder="Street and number"
                size="md"
                autoComplete="street-address"
              />
            </FormControl>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                name="city"
                value={values.city}
                onChange={handleChange}
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
              name="website"
              type="url"
              value={values.website}
              onChange={handleChange}
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
              name="instagram"
              value={values.instagram}
              onChange={handleChange}
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
