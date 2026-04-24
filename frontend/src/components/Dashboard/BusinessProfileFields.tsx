import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
  Divider,
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
    <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel>
              Business name
            </FormLabel>
            <Input
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Your business name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              Description
            </FormLabel>
            <Textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="A short tagline customers see on your booking page"
              rows={3}
            />
            <FormHelperText>
              Plain text is best here; use the About section for longer formatted content.
            </FormHelperText>
          </FormControl>

      <Divider />


          <FormControl>
            <FormLabel>
              Phone
            </FormLabel>
            <InputGroup size="sm">
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
                size="sm"
              />
            </InputGroup>
            <FormHelperText>Shown on your booking page. Include country code.</FormHelperText>
          </FormControl>

          <FormControl>
                <FormLabel>
                  Address
                </FormLabel>
                <Input
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  placeholder="Street and number"
                  size="sm"
                  autoComplete="address"
                />
          </FormControl>
          
          <FormControl>
                <FormLabel>
                  City
                </FormLabel>
                <Input
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  placeholder="City"
                  size="sm"
                />
            <FormHelperText>Helps customers find your location.</FormHelperText>
          </FormControl>


      <Divider />

      <Box>
        <Heading size="xs" color="text.strong" textTransform="uppercase" letterSpacing="wider" mb={3}>
          Online presence
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>
              Website
            </FormLabel>
            <Input
              name="website"
              type="url"
              value={values.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
            <FormHelperText>Your existing website, if you have one.</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>
              Instagram
            </FormLabel>
            <Input
              name="instagram"
              value={values.instagram}
              onChange={handleChange}
              placeholder="@yourbusiness or full profile URL"
            />
            <FormHelperText>@handle or full URL.</FormHelperText>
          </FormControl>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
