import { IconButton, type IconButtonProps } from '@chakra-ui/react';

export function RoundIconButton(props: IconButtonProps) {
  return (
    <IconButton
      borderRadius="full"
      bg="white"
      shadow="sm"
      _hover={{ bg: 'gray.50' }}
      {...props}
    />
  );
}
