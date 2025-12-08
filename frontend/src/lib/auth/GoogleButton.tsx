import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { signInWithGoogle, type User } from '../firebase';
import { GoogleIcon } from '../../components/icons';

interface GoogleButtonProps {
  onSuccess: (user: User) => void;
  onError?: (error: Error) => void;
  text?: string;
  isDisabled?: boolean;
}

export function GoogleButton({
  onSuccess,
  onError,
  text = 'Continue with Google',
  isDisabled = false,
}: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      onSuccess(result.user);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      isLoading={isLoading}
      isDisabled={isDisabled}
      leftIcon={<GoogleIcon />}
      variant="outline"
      size="lg"
      w="full"
      borderRadius="lg"
      fontWeight="500"
      _hover={{ bg: 'gray.50' }}
    >
      {text}
    </Button>
  );
}

