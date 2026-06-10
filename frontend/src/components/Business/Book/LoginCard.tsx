import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { GoogleIcon, LockIcon } from '../../icons';
import { BrandButton } from '../brand';

interface LoginCardProps {
  loading?: boolean;
  onGoogle: () => void;
}

export function LoginCard({ loading, onGoogle }: LoginCardProps) {
  return (
    <Box
      bg="surface.card"
      border="1.5px solid"
      borderColor="var(--brand-accent)"
      borderRadius="14px"
      p={5.5}
      boxShadow="0 0 0 3px var(--brand-accent-soft)"
    >
      <Flex align="flex-start" gap={3} mb={4}>
        <Flex
          w="36px"
          h="36px"
          borderRadius="full"
          bg="var(--brand-accent-soft)"
          color="var(--brand-accent)"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <LockIcon size={16} />
        </Flex>
        <Box flex="1">
          <Text fontSize="15px" fontWeight={600} color="text.heading">
            Sign in to confirm
          </Text>
          <Text fontSize="13px" color="text.muted" mt={0.5} lineHeight={1.45}>
            Sign in with your Google account so we can save your booking and send you a
            confirmation.
          </Text>
        </Box>
      </Flex>

      <BrandButton
        brandVariant="outline"
        size="lg"
        w="100%"
        leftIcon={<GoogleIcon size={18} />}
        onClick={onGoogle}
        isLoading={loading}
      >
        Continue with Google
      </BrandButton>

      <Text m="14px 0 0" fontSize="12px" color="text.muted" lineHeight={1.5} textAlign="center">
        By continuing, you agree to Book Easy's{' '}
        <Link color="var(--brand-accent)" fontWeight={600}>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link color="var(--brand-accent)" fontWeight={600}>
          Privacy Policy
        </Link>
        .
      </Text>
    </Box>
  );
}
