import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Text } from '@chakra-ui/react';

interface StripeEmbeddedCheckoutProps {
  clientSecret: string;
  publishableKey: string;
}

export default function StripeEmbeddedCheckout({
  clientSecret,
  publishableKey,
}: StripeEmbeddedCheckoutProps) {
  void clientSecret;
  void publishableKey;
  return (
    <Box>
      <Alert status="warning" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Stripe checkout not enabled</AlertTitle>
          <AlertDescription>
            Set <Text as="span" fontWeight="700">BILLING_MODE=stripe</Text> and configure Stripe keys
            to enable embedded checkout in this environment.
          </AlertDescription>
        </Box>
      </Alert>
    </Box>
  );
}

