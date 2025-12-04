import { Box, VStack, Text, Flex, Divider } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import {
  HomeIcon,
  CalendarIcon,
  LayersIcon,
  SettingsIcon,
  LogOutIcon,
} from '../icons';
import { ROUTES } from '../../config/routes';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Overview', icon: <HomeIcon size={20} />, path: ROUTES.DASHBOARD.ROOT },
  { label: 'Bookings', icon: <CalendarIcon size={20} />, path: `${ROUTES.DASHBOARD.ROOT}/bookings` },
  { label: 'Services', icon: <LayersIcon size={20} />, path: `${ROUTES.DASHBOARD.ROOT}/services` },
  { label: 'Settings', icon: <SettingsIcon size={20} />, path: `${ROUTES.DASHBOARD.ROOT}/settings` },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
    onClose?.();
  };

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD.ROOT) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Flex
      direction="column"
      h="full"
      bg="white"
      borderRight="1px"
      borderColor="gray.100"
    >
      {/* Logo */}
      <Box p={6} pb={4}>
        <Logo size="md" onClick={() => handleNavigate(ROUTES.HOME)} />
      </Box>

      <Divider borderColor="gray.100" />

      {/* Navigation */}
      <VStack spacing={1} align="stretch" flex={1} p={4}>
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="wider"
          px={3}
          mb={2}
        >
          Menu
        </Text>

        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Box
              key={item.path}
              as="button"
              display="flex"
              alignItems="center"
              gap={3}
              w="full"
              py={3}
              px={3}
              borderRadius="xl"
              bg={active ? 'brand.50' : 'transparent'}
              color={active ? 'brand.600' : 'gray.600'}
              fontWeight={active ? '600' : '500'}
              fontSize="sm"
              transition="all 0.2s"
              _hover={{
                bg: active ? 'brand.50' : 'gray.50',
                color: active ? 'brand.600' : 'gray.900',
              }}
              onClick={() => handleNavigate(item.path)}
            >
              <Box opacity={active ? 1 : 0.7}>{item.icon}</Box>
              {item.label}
            </Box>
          );
        })}
      </VStack>

      {/* Logout */}
      <Box p={4} borderTop="1px" borderColor="gray.100">
        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap={3}
          w="full"
          py={3}
          px={3}
          borderRadius="xl"
          color="gray.500"
          fontWeight="500"
          fontSize="sm"
          transition="all 0.2s"
          _hover={{ bg: 'red.50', color: 'red.500' }}
          onClick={handleLogout}
        >
          <LogOutIcon size={20} />
          Log out
        </Box>
      </Box>
    </Flex>
  );
}

