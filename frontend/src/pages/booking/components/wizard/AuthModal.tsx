import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';

// Custom SVG Social Icons matching Fresha Style
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" style={{ marginRight: '10px' }}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: '10px' }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.77H24v9.03h12.75c-.55 2.87-2.22 5.31-4.72 6.98l7.34 5.69C43.59 36.42 46.5 30.76 46.5 24z"/>
      <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.34-5.69c-2.2 1.48-5.01 2.36-8.55 2.36-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, name: string) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    triggerMockLogin(email, 'usman khan');
  };

  const triggerMockLogin = (selectedEmail: string, selectedName: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(selectedEmail, selectedName);
      onClose();
    }, 850);
  };

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.4)"
      backdropFilter="blur(2px)"
      zIndex={1500}
      align="center"
      justify="center"
      p={4}
    >
      <Box
        position="relative"
        bg="white"
        w="100%"
        maxW="460px"
        borderRadius="28px"
        p={8}
        boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      >
        {/* Close Button */}
        <IconButton
          position="absolute"
          top="24px"
          right="24px"
          variant="unstyled"
          aria-label="Close modal"
          icon={<CloseIcon />}
          onClick={onClose}
          minW="auto"
          h="auto"
          p={1}
          borderRadius="full"
          _hover={{ bg: 'gray.100' }}
        />

        {loading ? (
          <Flex direction="column" align="center" justify="center" py={12} minH="300px">
            <Spinner size="xl" color="black" thickness="3px" mb={4} />
            <Text fontSize="sm" fontWeight="600" color="gray.600">
              Verifying your credentials...
            </Text>
          </Flex>
        ) : (
          <VStack align="stretch" spacing={0}>
            {/* Header */}
            <Text
              fontSize="24px"
              fontWeight="700"
              color="black"
              letterSpacing="-0.02em"
              lineHeight="1.2"
              mb={1}
            >
              Log in or sign up to book
            </Text>
            <Text fontSize="sm" color="gray.500" mb={6}>
              We&apos;ll need to verify it&apos;s you to continue
            </Text>

            {/* Email Field */}
            <form onSubmit={handleContinue}>
              <VStack align="stretch" spacing={0} mb={6}>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  color="gray.700"
                  mb={2}
                  letterSpacing="0.02em"
                >
                  Email
                </Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  h="50px"
                  borderRadius="12px"
                  border="1px solid"
                  borderColor="gray.200"
                  px={4}
                  fontSize="sm"
                  _placeholder={{ color: 'gray.400' }}
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'black', boxShadow: 'none' }}
                  isDisabled={true}
                  required
                />
                <Text fontSize="xs" color="gray.400" mt={2}>
                  We&apos;ll send you a verification code
                </Text>
              </VStack>

              {/* Continue button */}
              <Button
                type="submit"
                w="100%"
                h="50px"
                bg="black"
                color="white"
                borderRadius="full"
                fontWeight="700"
                fontSize="sm"
                mb={6}
                isDisabled={true}
                _hover={{ bg: 'gray.800' }}
                _active={{ bg: 'black' }}
                _disabled={{
                  bg: '#F3F3F5',
                  color: 'gray.400',
                  cursor: 'not-allowed',
                  opacity: 0.7
                }}
              >
                Continue
              </Button>
            </form>

            {/* Divider */}
            <HStack spacing={4} align="center" mb={6}>
              <Box flex={1} h="1px" bg="gray.100" />
              <Text fontSize="xs" fontWeight="700" color="gray.400" letterSpacing="0.05em">
                OR
              </Text>
              <Box flex={1} h="1px" bg="gray.100" />
            </HStack>

            {/* Social Logins */}
            <VStack spacing={3} align="stretch">
              <Button
                variant="outline"
                h="50px"
                borderRadius="full"
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                color="black"
                fontWeight="600"
                fontSize="sm"
                leftIcon={<FacebookIcon />}
                onClick={() => triggerMockLogin('usman.fb@facebook.com', 'usman khan')}
                _hover={{ bg: 'gray.50' }}
                _active={{ bg: 'white' }}
              >
                Continue with Facebook
              </Button>

              <Button
                variant="outline"
                h="50px"
                borderRadius="full"
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                color="black"
                fontWeight="600"
                fontSize="sm"
                leftIcon={<GoogleIcon />}
                onClick={() => triggerMockLogin('1070125@gmail.com', 'usman khan')}
                _hover={{ bg: 'gray.50' }}
                _active={{ bg: 'white' }}
              >
                Continue with Google
              </Button>
            </VStack>
          </VStack>
        )}
      </Box>
    </Flex>
  );
}
