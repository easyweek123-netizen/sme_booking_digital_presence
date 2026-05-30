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
        borderColor="border.strong"
        alignItems="flex-start"
        justifyContent="center"
      >
        <Text fontSize="xs" color="text.secondary" lineHeight="1.4" mt="-2px">
          I agree to the{' '}
          <Link href={ROUTES.TERMS} color="accent.primary">Terms of Service</Link>{' '}and{' '}
          <Link href={ROUTES.PRIVACY} color="accent.primary">Privacy Policy</Link>.
        </Text>
      </Checkbox>
      <GoogleButton
        onSuccess={auth.onSuccess}
        onError={auth.onError}
        isDisabled={!state.termsAccepted}
        text="Continue with Google"
        h="54px"
        bg="surface.card"
        color="text.primary"
        borderWidth="1px"
        borderColor="border.strong"
        borderRadius="full"
        _hover={{ bg: 'surface.muted' }}
      />
    </VStack>
  );
}
