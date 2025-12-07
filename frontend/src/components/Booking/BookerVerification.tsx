import { useState } from 'react';
import {
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { GoogleButton } from '../../lib/auth';
import { type User } from '../../lib/firebase';

interface BookerVerificationProps {
  onVerified: (user: User, name: string) => void;
  onError?: (error: Error) => void;
  businessName: string;
}

export function BookerVerification({
  onVerified,
  onError,
  businessName,
}: BookerVerificationProps) {
  const [name, setName] = useState('');

  function handleGoogleSuccess(user: User) {
    // For Google, use the display name if no name was entered
    const finalName = name.trim() || user.displayName || user.email?.split('@')[0] || 'Guest';
    onVerified(user, finalName);
  }

  return (
    <VStack spacing={6} w="full" p={4}>
      <VStack spacing={1} textAlign="center">
        <Text fontSize="lg" fontWeight="600" color="gray.900">
          Complete your booking
        </Text>
        <Text color="gray.600" fontSize="sm">
          at {businessName}
        </Text>
      </VStack>

      <FormControl>
        <FormLabel color="gray.700" fontSize="sm">
          Your name (optional)
        </FormLabel>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Smith"
          size="lg"
          borderRadius="lg"
          _focus={{
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          }}
        />
      </FormControl>

      <VStack spacing={3} w="full">
        <GoogleButton
          onSuccess={handleGoogleSuccess}
          onError={onError}
          text="Continue with Google"
        />

        <Text color="gray.500" fontSize="xs" textAlign="center" pt={2}>
          Sign in to complete your booking
        </Text>
      </VStack>
    </VStack>
  );
}
