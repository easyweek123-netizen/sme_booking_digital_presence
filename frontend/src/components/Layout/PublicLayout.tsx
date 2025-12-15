import { Flex, Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function PublicLayout() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box flex={1} display="flex" flexDirection="column">
        <Outlet />
      </Box>
    </Flex>
  );
}

