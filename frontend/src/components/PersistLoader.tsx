import { Center, Spinner } from '@chakra-ui/react';

export function PersistLoader() {
  return (
    <Center h="100vh">
      <Spinner size="xl" color="accent.primary" thickness="4px" />
    </Center>
  );
}
