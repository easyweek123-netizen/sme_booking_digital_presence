import { Checkbox, Link, Text, VStack } from '@chakra-ui/react';
import { GoogleButton } from '../../../lib/auth';
import { ROUTES } from '../../../config/routes';
import type { StepProps } from '../types';

export function AccountFields({ flow }: StepProps) {
  const { state, update, auth } = flow;
  return (
    <VStack spacing={5} align="stretch">
      <Checkbox
        isChecked={state.termsAccepted}
        onChange={(e) => update({ termsAccepted: e.target.checked })}
        colorScheme="brand"
        borderColor="whiteAlpha.400"
        alignItems="flex-start"
      >
        <Text fontSize="xs" color="whiteAlpha.700" lineHeight="1.4" mt="-2px" textAlign="left">
          I agree to the{' '}
          <Link href={ROUTES.TERMS} color="brand.300">Terms of Service</Link>{' '}and{' '}
          <Link href={ROUTES.PRIVACY} color="brand.300">Privacy Policy</Link>.
        </Text>
      </Checkbox>
      <GoogleButton
        onSuccess={auth.onSuccess}
        onError={auth.onError}
        isDisabled={!state.termsAccepted}
        text="Continue with Google"
        h="54px"
        bg="white"
        color="black"
        borderRadius="full"
        _hover={{ bg: 'gray.200' }}
      />
    </VStack>
  );
}
