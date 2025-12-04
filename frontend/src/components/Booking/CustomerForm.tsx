import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import type { CustomerData } from '../../types';

interface CustomerFormProps {
  onSubmit: (data: CustomerData) => void;
  isLoading: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export function CustomerForm({ onSubmit, isLoading }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
        break;
      case 'phone':
        if (!value.trim()) return 'Phone is required';
        // Remove non-digits for validation
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) return 'Phone must have at least 10 digits';
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof CustomerData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true });

    // Submit if no errors
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={touched.name && !!errors.name}>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
            Full Name
          </FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Smith"
            size="lg"
            borderRadius="lg"
            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={touched.email && !!errors.email}>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
            Email
          </FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="john@example.com"
            size="lg"
            borderRadius="lg"
            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={touched.phone && !!errors.phone}>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
            Phone
          </FormLabel>
          <Input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(555) 123-4567"
            size="lg"
            borderRadius="lg"
            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
          />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>

        <Box pt={4}>
          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            w="full"
            h="56px"
            fontSize="md"
            fontWeight="600"
            isLoading={isLoading}
            loadingText="Booking..."
            borderRadius="xl"
          >
            Confirm Booking
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}

