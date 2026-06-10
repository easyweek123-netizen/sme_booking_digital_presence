import { IconButton, type IconButtonProps } from '@chakra-ui/react';

export function RoundIconButton(props: IconButtonProps) {
  return (
    <IconButton
      borderRadius="full"
      bg="surface.card"
      shadow="sm"
      _hover={{ bg: 'surface.alt' }}
      {...props}
    />
  );
}
