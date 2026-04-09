import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';

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
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500">
          Business Name
        </FormLabel>
        <Input
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Your business name"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500">
          Description
        </FormLabel>
        <Textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Tell customers about your business"
          rows={3}
        />
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="500">
            Phone
          </FormLabel>
          <Input
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="500">
            City
          </FormLabel>
          <Input
            name="city"
            value={values.city}
            onChange={handleChange}
            placeholder="New York"
          />
        </FormControl>
      </SimpleGrid>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500">
          Address
        </FormLabel>
        <Input
          name="address"
          value={values.address}
          onChange={handleChange}
          placeholder="123 Main St"
        />
      </FormControl>

      <Divider />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="500">
            Website
          </FormLabel>
          <Input
            name="website"
            type="url"
            value={values.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="500">
            Instagram
          </FormLabel>
          <Input
            name="instagram"
            value={values.instagram}
            onChange={handleChange}
            placeholder="@yourbusiness"
          />
        </FormControl>
      </SimpleGrid>
    </VStack>
  );
}
