import { Center, Spinner } from '@chakra-ui/react';

export function PersistLoader() {
  return (
    <Center h="100vh">
      <Spinner size="xl" color="brand.500" thickness="4px" />
    </Center>
  );
}
