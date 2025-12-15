import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function PublicLayout() {
  return (
    <Box minH="100vh">
      <Header />
      <Outlet />
    </Box>
  );
}

